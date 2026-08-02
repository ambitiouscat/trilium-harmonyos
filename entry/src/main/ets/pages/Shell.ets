/*
 * Trilium 正式壳页面（openspec arkweb-shell-mvp 任务 3.1/3.2/3.4）
 *
 * 结构：EntryAbility -> Shell.ets（全屏 Web）+ NativeHttpBridge（出站 HTTP）
 *       + napi_init.cpp 的 NDK SW scheme handler（SW 请求静态服务）
 *
 * 请求链路（Phase 1 spike 结论，路径 a）：
 *   - https://localhost 静态资源：本页 ArkTS scheme handler（页面直达请求）
 *     + NDK SW scheme handler（SW 上下文 fetch）双侧从 rawfile/dist 服务，
 *     带 MIME + COOP/COEP 头（COEP 使 crossOriginIsolated=true / SharedArrayBuffer 可用）。
 *   - /bootstrap、/api/、/sync/、/search/：由 sw.js 接管并 forwardToClientLocalServer
 *     到页面 local-bridge 再进 local-server worker。原生层不抢答——SW 激活后这些请求
 *     根本到不了原生拦截层；激活前 bootstrap 也不会发 API 请求。兜底 404 + 告警日志。
 *   - src/main.js：双侧 scheme handler 均在传输层注入前缀补丁（import local-bridge2
 *     并 registerNativeHttpHandler），不改 dist 文件本身。
 */

import { webview, WebNetErrorList } from '@kit.ArkWeb';
import { buffer } from '@kit.ArkTS';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { BusinessError, deviceInfo } from '@kit.BasicServicesKit';
import { NativeHttpBridge } from '../shell/NativeHttpBridge';

const TAG = 'SHELL';
const DOMAIN = 0x0001;
const ORIGIN = 'https://localhost';
const LOCAL_API_PREFIXES = ['/bootstrap', '/api/', '/sync/', '/search/'];

// javaScriptOnDocumentStart 注入：window.__triliumNativeHttp 钩子（须在 main.js 模块求值前定义）
const NH_HOOK_SCRIPT = `(function(){
  window.__triliumNhSeq = 0;
  window.__triliumNhPending = {};
  window.__triliumNativeHttp = function(request) {
    return new Promise(function(resolve, reject) {
      var id = String(++window.__triliumNhSeq);
      window.__triliumNhPending[id] = { resolve: resolve, reject: reject };
      try {
        triliumNative.httpRequest(id, JSON.stringify(request));
      } catch (e) {
        delete window.__triliumNhPending[id];
        reject(e);
      }
    });
  };
  window.__triliumNhResolve = function(id, payloadStr) {
    var p = window.__triliumNhPending[id];
    if (!p) return;
    delete window.__triliumNhPending[id];
    try {
      var payload = JSON.parse(payloadStr);
      if (typeof payload.body === 'string' && !payload.base64) {
        // data/body 分离：JSON 在此 parse 一次成 data，structured clone 给 worker，避免二次 parse
        try { payload.data = JSON.parse(payload.body); delete payload.body; } catch (e) { /* 非 JSON，保留 body */ }
      }
      delete payload.base64;
      p.resolve(payload);
    } catch (e) {
      p.reject(e);
    }
  };
  window.__triliumNhReject = function(id, message) {
    var p = window.__triliumNhPending[id];
    if (!p) return;
    delete window.__triliumNhPending[id];
    p.reject(new Error(message));
  };
  // 分段装配：ArkTS 侧大响应切片回传，finalize 后走同一 __triliumNhResolve（JSON.parse 仅一次）
  window.__triliumNhChunks = {};
  window.__triliumNhChunkStart = function(id) {
    window.__triliumNhChunks[id] = [];
  };
  window.__triliumNhChunk = function(id, chunk) {
    var c = window.__triliumNhChunks[id];
    if (c) c.push(chunk);
  };
  window.__triliumNhChunkEnd = function(id) {
    var c = window.__triliumNhChunks[id];
    if (!c) return;
    delete window.__triliumNhChunks[id];
    window.__triliumNhResolve(id, c.join(''));
  };
})();`;

// main.js 传输层补丁前缀（local-bridge2.js 导出表：i = registerNativeHttpHandler）
const MAIN_JS_PATCH_PREFIX = `import { i as __triliumRegNH } from './local-bridge2.js';\n` +
  `if (typeof window.__triliumNativeHttp === 'function') { __triliumRegNH(window.__triliumNativeHttp); console.log('[ShellPatch] native http handler registered'); } else { console.log('[ShellPatch] WARNING: __triliumNativeHttp missing at main.js eval'); }\n`;

// 3.3 验收自检：经 javaScriptProxy → @ohos.net.http 对真实服务器发一次 GET
const NH_SELFTEST_SCRIPT = `(async()=>{try{if(typeof window.__triliumNativeHttp!=='function'){console.log('[SHELL-SELFTEST] __triliumNativeHttp missing');return;}const r=await window.__triliumNativeHttp({method:'GET',url:'https://tm.xiyue999.cn/',headers:{}});console.log('[SHELL-SELFTEST] native http GET status='+r.status+' bodyLen='+((r.data!==undefined)?JSON.stringify(r.data).length:(r.body||'').length)+' ctype='+(r.headers?r.headers['content-type']:'?'));}catch(e){console.log('[SHELL-SELFTEST] native http ERROR '+e);}})();`;

// XHR 怪癖回归检查（spike 遗留：原生 scheme handler 直接应答时 XHR responseText 曾为空）。
// 正式链路下静态 XHR 经 SW→NDK handler、API XHR 经 SW→worker，均应正常拿到响应体。
const XHR_SELFTEST_SCRIPT = `(function(){try{const x=new XMLHttpRequest();x.open('GET','/manifest.webmanifest');x.onload=function(){console.log('[SHELL-SELFTEST][xhr-static] status='+x.status+' responseText.len='+x.responseText.length);};x.onerror=function(){console.log('[SHELL-SELFTEST][xhr-static] ERROR onerror');};x.send();}catch(e){console.log('[SHELL-SELFTEST][xhr-static] ERROR '+e);}})();`;

// 3.9 端到端离线验证（3.7 布局探针也在这里，等 glob 就绪后上报）。
// 分段状态机（localStorage 'shell-e2e' 跨重启持久）：
//   stage0 库未初始化 -> POST /api/setup/new-document?skipDemoDb=1 -> reload
//   stageA 无 noteId  -> 创建笔记 + 更新内容，等重启
//   stageB 有 noteId  -> 读回 + 全文搜索 + 删除 + 删除后搜索，E2E DONE
// 同时安装 hashchange 监听 + pushState，供 3.5 返回键 hdc 注入验证。
const E2E_SCRIPT = `(async()=>{
  if (window.__shellE2eRunning) return;
  window.__shellE2eRunning = true;
  const L = (m) => console.log('[SHELL-E2E] ' + m);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const H = { 'Content-Type': 'application/json' };
  const J = async (r) => { const t = await r.text(); try { return JSON.parse(t); } catch (e) { return t; } };
  try {
    window.addEventListener('hashchange', () => console.log('[SHELL-SELFTEST][back] hashchange fired (webview backward consumed)'));
    if (!location.hash) history.pushState({}, '', '#shell-back-test');

    let glob = null;
    for (let i = 0; i < 40; i++) { if (window.glob) { glob = window.glob; break; } await sleep(1000); }
    if (glob && glob.csrfToken) H['x-csrf-token'] = glob.csrfToken;
    L('glob ready=' + !!glob +
      ' device=' + (glob ? glob.device : '?') +
      ' pointerCoarse=' + (window.matchMedia ? matchMedia('(pointer:coarse)').matches : '?') +
      ' orientationInWindow=' + ('orientation' in window) +
      ' deviceCookie=' + (document.cookie.split(';').map(s => s.trim()).find(s => s.indexOf('trilium-device') === 0) || 'none'));

    let ok = false;
    for (let i = 0; i < 25; i++) {
      try { const p = await fetch('/api/notes/root', { headers: H }); if (p.ok) { ok = true; break; } } catch (e) {}
      await sleep(1000);
    }
    if (!ok) {
      L('library not initialized, POST /api/setup/new-document?skipDemoDb=1');
      const r = await fetch('/api/setup/new-document?skipDemoDb=1', { method: 'POST', headers: H, body: JSON.stringify({ locale: 'en' }) });
      L('setup status=' + r.status + ' body=' + (await r.text()).slice(0, 150));
      location.reload();
      return;
    }

    let state = {};
    try { state = JSON.parse(localStorage.getItem('shell-e2e') || '{}'); } catch (e) {}
    if (!state.noteId) {
      const cr = await fetch('/api/notes/root/children?target=into', { method: 'POST', headers: H,
        body: JSON.stringify({ title: 'shell-e2e-note', type: 'text', content: '<p>shell-e2e-token-12345</p>' }) });
      const cj = await J(cr);
      const noteId = (cj && cj.note) ? cj.note.noteId : null;
      L('create note status=' + cr.status + ' noteId=' + noteId + ' resp=' + JSON.stringify(cj).slice(0, 120));
      if (!noteId) return;
      state.noteId = noteId;
      const ur = await fetch('/api/notes/' + noteId + '/data', { method: 'PUT', headers: H,
        body: JSON.stringify({ content: '<p>shell-e2e-token-67890-updated</p>' }) });
      state.updated = ur.ok;
      L('update content status=' + ur.status);
      localStorage.setItem('shell-e2e', JSON.stringify(state));
      L('stage A done (create+update), restart app for persistence check');
    } else {
      const gr = await fetch('/api/notes/' + state.noteId, { headers: H });
      const gj = await J(gr);
      L('readback status=' + gr.status + ' title=' + (gj ? gj.title : '?'));
      const br = await fetch('/api/notes/' + state.noteId + '/blob', { headers: H });
      const bj = await J(br);
      L('blob status=' + br.status + ' body=' + JSON.stringify(bj).slice(0, 150));
      const sr = await fetch('/api/search/shell-e2e-token-67890', { headers: H });
      const sj = await J(sr);
      L('search status=' + sr.status + ' results=' + (Array.isArray(sj) ? sj.length : JSON.stringify(sj).slice(0, 150)));
      const dr = await fetch('/api/notes/' + state.noteId + '?taskId=shell-e2e-del&last=true', { method: 'DELETE', headers: H });
      L('delete status=' + dr.status);
      const sr2 = await fetch('/api/search/shell-e2e-token-67890', { headers: H });
      const sj2 = await J(sr2);
      L('search-after-delete status=' + sr2.status + ' results=' + (Array.isArray(sj2) ? sj2.length : JSON.stringify(sj2).slice(0, 150)));
      localStorage.removeItem('shell-e2e');
      L('E2E DONE');
    }
  } catch (e) {
    L('ERROR ' + e);
  }
})();`;

function mimeFor(path: string): string {
  const dot = path.lastIndexOf('.');
  if (dot < 0) {
    return 'application/octet-stream';
  }
  const ext = path.substring(dot + 1).toLowerCase();
  switch (ext) {
    case 'html': return 'text/html';
    case 'js':
    case 'mjs': return 'text/javascript';
    case 'css': return 'text/css';
    case 'json':
    case 'map': return 'application/json';
    case 'webmanifest': return 'application/manifest+json';
    case 'wasm': return 'application/wasm';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'svg': return 'image/svg+xml';
    case 'ico': return 'image/x-icon';
    case 'woff': return 'font/woff';
    case 'woff2': return 'font/woff2';
    case 'ttf': return 'font/ttf';
    case 'txt': return 'text/plain';
    case 'xml': return 'application/xml';
    case 'pdf': return 'application/pdf';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'mp4': return 'video/mp4';
    default: return 'application/octet-stream';
  }
}

function isTextMime(mime: string): boolean {
  return mime.startsWith('text/') || mime === 'application/json' ||
    mime === 'application/manifest+json' || mime === 'image/svg+xml' || mime === 'application/xml';
}

@Entry
@Component
struct Shell {
  controller: webview.WebviewController = new webview.WebviewController();
  schemeHandler: webview.WebSchemeHandler = new webview.WebSchemeHandler();
  httpBridge: NativeHttpBridge = new NativeHttpBridge();
  @State bottomPad: number = 0;
  private cookieVerified: boolean = false;
  private hookScripts: Array<ScriptItem> = [{ script: NH_HOOK_SCRIPT, scriptRules: ['*'] }];

  aboutToAppear(): void {
    // 3.2 cookie：显式打开 cookie 接受（https://localhost 域）
    try {
      webview.WebCookieManager.putAcceptCookieEnabled(true);
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'putAcceptCookieEnabled failed: %{public}s', JSON.stringify(err));
    }
    // 3.7 多设备形态：按 deviceInfo.deviceType 注入 trilium-device cookie（在页面加载前）。
    // 2in1 触屏会让 matchMedia('(pointer:coarse)') 命中而误判 mobile 布局，
    // cookie 在 Trilium getDevice() 判定链中优先于 isMobile()，是最稳的注入点。
    // 手机/平板注入 mobile；其余（2in1/tablet 以外的桌面形态）强制 desktop。
    try {
      const devType = deviceInfo.deviceType;
      const device = (devType === 'phone' || devType === 'tablet') ? 'mobile' : 'desktop';
      webview.WebCookieManager.configCookieSync(ORIGIN, `trilium-device=${device}; path=/`);
      hilog.info(DOMAIN, TAG, '[device] deviceType=%{public}s -> trilium-device=%{public}s', devType, device);
    } catch (err) {
      hilog.error(DOMAIN, TAG, '[device] inject failed: %{public}s', JSON.stringify(err));
    }
    // 3.4 键盘适配：键盘弹出时收缩视口（2in1 主要为软键盘场景）
    try {
      window.getLastWindow(getContext(this)).then((win: window.Window) => {
        win.on('avoidAreaChange', (data: window.AvoidAreaOptions) => {
          if (data.type === window.AvoidAreaType.TYPE_KEYBOARD) {
            this.bottomPad = data.area.bottomRect.height;
          }
        });
      });
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'avoidAreaChange setup failed: %{public}s', JSON.stringify(err));
    }
  }

  buildResponse(status: number, statusText: string, mime: string): webview.WebSchemeHandlerResponse {
    const response = new webview.WebSchemeHandlerResponse();
    response.setNetErrorCode(WebNetErrorList.NET_OK);
    response.setStatus(status);
    response.setStatusText(statusText);
    response.setMimeType(mime);
    if (isTextMime(mime)) {
      response.setEncoding('utf-8');
    }
    response.setHeaderByName('Cross-Origin-Opener-Policy', 'same-origin', false);
    response.setHeaderByName('Cross-Origin-Embedder-Policy', 'require-corp', false);
    response.setHeaderByName('Cache-Control', 'no-cache', false);
    return response;
  }

  sendResponse(resourceHandler: webview.WebResourceHandler, response: webview.WebSchemeHandlerResponse,
    body: ArrayBuffer): void {
    try {
      resourceHandler.didReceiveResponse(response);
      if (body.byteLength > 0) {
        resourceHandler.didReceiveResponseBody(body);
      }
      resourceHandler.didFinish();
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'sendResponse error: %{public}s', JSON.stringify(err));
    }
  }

  sendText(resourceHandler: webview.WebResourceHandler, status: number, statusText: string,
    mime: string, text: string): void {
    const response = this.buildResponse(status, statusText, mime);
    const buf = buffer.from(text);
    this.sendResponse(resourceHandler, response,
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
  }

  serveDist(url: string, resourceHandler: webview.WebResourceHandler): void {
    let path = url.substring(ORIGIN.length);
    const q = path.indexOf('?');
    if (q >= 0) {
      path = path.substring(0, q);
    }
    const hash = path.indexOf('#');
    if (hash >= 0) {
      path = path.substring(0, hash);
    }
    // 本地 API 前缀：正常由 SW → local-bridge → worker 处理，到不了这里；兜底
    if (LOCAL_API_PREFIXES.some((p: string) => path.startsWith(p))) {
      hilog.warn(DOMAIN, TAG, 'local api request reached native handler (SW not controlling?): %{public}s', path);
      this.sendText(resourceHandler, 404, 'Not Found', 'application/json',
        '{"error":"local api handled by service worker bridge"}');
      return;
    }
    try {
      path = decodeURI(path);
    } catch (err) {
      // 保留原样
    }
    if (path === '' || path === '/') {
      path = '/index.html';
    }
    if (path.includes('..')) {
      this.sendText(resourceHandler, 403, 'Forbidden', 'text/plain', 'forbidden');
      return;
    }
    const rawPath = 'dist' + path;
    try {
      const data: Uint8Array = getContext(this).resourceManager.getRawFileContentSync(rawPath);
      let ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      // 传输层补丁：main.js 前置 registerNativeHttpHandler 注册（不改 dist 文件）
      if (path === '/src/main.js') {
        const text = buffer.from(ab as ArrayBuffer).toString('utf-8');
        const patched = buffer.from(MAIN_JS_PATCH_PREFIX + text);
        ab = patched.buffer.slice(patched.byteOffset, patched.byteOffset + patched.length);
        hilog.info(DOMAIN, TAG, 'served main.js with native-http patch (page handler)');
      }
      const response = this.buildResponse(200, 'OK', mimeFor(path));
      this.sendResponse(resourceHandler, response, ab);
    } catch (err) {
      hilog.warn(DOMAIN, TAG, '404 %{public}s', rawPath);
      this.sendText(resourceHandler, 404, 'Not Found', 'text/plain', 'not found: ' + rawPath);
    }
  }

  setupSchemeHandler(): void {
    this.schemeHandler.onRequestStart(
      (request: webview.WebSchemeHandlerRequest, resourceHandler: webview.WebResourceHandler) => {
        const url = request.getRequestUrl();
        try {
          if (url.startsWith(ORIGIN)) {
            this.serveDist(url, resourceHandler);
            return true;
          }
          return false;
        } catch (err) {
          hilog.error(DOMAIN, TAG, 'onRequestStart error: %{public}s', JSON.stringify(err));
          return false;
        }
      });
    this.controller.setWebSchemeHandler('https', this.schemeHandler);
    hilog.info(DOMAIN, TAG, 'setWebSchemeHandler(https) done');
  }

  // 3.2 cookie 验证：JS 写→原生读、原生写→JS 读，各打日志（每次启动只跑一次）
  verifyCookies(): void {
    this.controller.runJavaScript(
      `(function(){document.cookie='trilium_shell_js=written-by-js;path=/;SameSite=Lax';return document.cookie;})();`,
      (err, result) => {
        hilog.info(DOMAIN, TAG, '[cookie] JS wrote, document.cookie=%{public}s', String(result));
        setTimeout(() => {
          try {
            const nativeRead = webview.WebCookieManager.fetchCookieSync(ORIGIN);
            hilog.info(DOMAIN, TAG, '[cookie] native fetchCookieSync=%{public}s', nativeRead);
            webview.WebCookieManager.configCookieSync(ORIGIN, 'trilium_shell_native=written-by-native');
            const nativeRead2 = webview.WebCookieManager.fetchCookieSync(ORIGIN);
            hilog.info(DOMAIN, TAG, '[cookie] after configCookieSync, native=%{public}s', nativeRead2);
            this.controller.runJavaScript(
              `(function(){return document.cookie;})();`,
              (err2, result2) => {
                hilog.info(DOMAIN, TAG, '[cookie] JS reads back document.cookie=%{public}s', String(result2));
              });
          } catch (e) {
            hilog.error(DOMAIN, TAG, '[cookie] verify failed: %{public}s', JSON.stringify(e));
          }
        }, 500);
      });
  }

  // 3.4 返回键：webview 后退栈优先，无历史则退系统（返回 false 交默认行为）
  onBackPress(): boolean {
    const canBack = this.controller.accessBackward();
    hilog.info(DOMAIN, TAG, '[back] onBackPress accessBackward=%{public}s', String(canBack));
    if (canBack) {
      this.controller.backward();
      return true;
    }
    return false;
  }

  aboutToDisappear(): void {
    // 与 javaScriptProxy 配对，防内存泄漏
    try {
      this.controller.deleteJavaScriptRegister('triliumNative');
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'deleteJavaScriptRegister failed: %{public}s', JSON.stringify(err));
    }
  }

  build() {
    Column() {
      Web({ src: ORIGIN + '/index.html', controller: this.controller })
        .onControllerAttached(() => {
          hilog.info(DOMAIN, TAG, 'onControllerAttached');
          this.setupSchemeHandler();
          this.httpBridge.setController(this.controller);
        })
        .onPageBegin(() => {
          hilog.info(DOMAIN, TAG, 'onPageBegin');
        })
        .onPageEnd(() => {
          hilog.info(DOMAIN, TAG, 'onPageEnd');
          if (!this.cookieVerified) {
            this.cookieVerified = true;
            this.verifyCookies();
            // 3.3 自检：经原生网络栈的真实 GET；XHR 怪癖回归检查
            setTimeout(() => {
              this.controller.runJavaScript(NH_SELFTEST_SCRIPT);
              this.controller.runJavaScript(XHR_SELFTEST_SCRIPT);
            }, 3000);
          }
          // 3.9 E2E 已验收完成，注入已禁用：该脚本会在库未初始化时自动 POST /api/setup/new-document，
          // 会打断用户的"从服务器同步"向导流程（自动初始化本地空库导致跳主界面 + 双文档冲突）。
          // 如需重跑 E2E，临时恢复此注入即可（E2E_SCRIPT 常量保留）。
          // setTimeout(() => {
          //   this.controller.runJavaScript(E2E_SCRIPT);
          // }, 4000);
          // 注：syncMaxBlobContentSize 的修复在 NativeHttpBridge 出站补丁里（Trilium 白名单
          // 不允许客户端 PUT 该 option，本地 API 路线已实证 400 不可行）。
        })
        .onConsole((event) => {
          if (event) {
            hilog.info(DOMAIN, TAG, '[web:%{public}d] %{public}s',
              event.message.getMessageLevel(), event.message.getMessage());
          }
          return false;
        })
        .onErrorReceive((event) => {
          if (event) {
            hilog.error(DOMAIN, TAG, '[web-err] %{public}s code=%{public}d %{public}s',
              event.request.getRequestUrl(), event.error.getErrorCode(), event.error.getErrorInfo());
          }
        })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .fileAccess(true)
        .onlineImageAccess(true)
        .javaScriptOnDocumentStart(this.hookScripts)
        .javaScriptProxy({
          object: this.httpBridge,
          name: 'triliumNative',
          methodList: ['httpRequest'],
          asyncMethodList: [],
          controller: this.controller
        })
        .width('100%')
        .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .padding({ bottom: this.bottomPad })
  }
}

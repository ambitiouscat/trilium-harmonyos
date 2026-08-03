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
import { BusinessError, deviceInfo } from '@kit.BasicServicesKit';
import { fileIo as fs } from '@kit.CoreFileKit';
import { common } from '@kit.AbilityKit';
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
  // 1.2/2.2 原生回调基础设施：proxy 同步方法（fire-and-forget）经 id 配对，
  // 原生完成时 runJavaScript 调 __triliumPbResolve 回传结果
  window.__triliumPbSeq = 0;
  window.__triliumPbPending = {};
  window.__triliumPbResolve = function(id, r) {
    var p = window.__triliumPbPending[id];
    if (!p) return;
    delete window.__triliumPbPending[id];
    p(r);
  };
  window.__triliumNativeCall = function(method, arg) {
    return new Promise(function(resolve) {
      var id = 'pb' + (++window.__triliumPbSeq);
      window.__triliumPbPending[id] = resolve;
      triliumNative[method](id, arg);
    }).then(function(r) {
      // 'cancelled'（用户取消 picker）与 'sandbox:'（降级落盘）都是合法终态，交给调用方展示
      if (r === 'cancelled' || (typeof r === 'string' && r.indexOf('sandbox:') === 0)) return r;
      if (typeof r !== 'string' || r.indexOf('ok') !== 0) throw new Error('native ' + method + ' failed: ' + r);
      return r;
    });
  };
  // 1.2 剪贴板降级桥：web 写剪贴板被 NotAllowedError 拒绝时回落原生 pasteboard
  //（https://localhost 安全上下文下 API 存在但写权限被拒，实测见 [SHELL-CLIP] 日志）
  (function patchClipboard() {
    function nativeText(text) {
      console.log('[SHELL-CLIP] web write denied, native pasteboard fallback (text)');
      return window.__triliumNativeCall('pasteboardSetText', String(text)).then(function() {
        console.log('[SHELL-CLIP] native writeText OK');
      });
    }
    function nativeImage(item) {
      var types = item.types || [];
      var type = types.indexOf('image/png') >= 0 ? 'image/png' : types[0];
      if (!type || type.indexOf('image/') !== 0) throw new Error('no image type in ClipboardItem');
      console.log('[SHELL-CLIP] web write denied, native pasteboard fallback (' + type + ')');
      return item.getType(type).then(function(blob) { return blob.arrayBuffer(); }).then(function(ab) {
        var bytes = new Uint8Array(ab);
        var bin = '';
        var STEP = 32768;
        for (var i = 0; i < bytes.length; i += STEP) {
          bin += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + STEP, bytes.length)));
        }
        return window.__triliumNativeCall('pasteboardSetImagePng', btoa(bin));
      }).then(function() {
        console.log('[SHELL-CLIP] native write image OK');
      });
    }
    if (navigator.clipboard) {
      var origWriteText = navigator.clipboard.writeText ? navigator.clipboard.writeText.bind(navigator.clipboard) : null;
      var origWrite = navigator.clipboard.write ? navigator.clipboard.write.bind(navigator.clipboard) : null;
      navigator.clipboard.writeText = function(text) {
        var p = origWriteText ? origWriteText(text) : Promise.reject(new Error('writeText unavailable'));
        return p.catch(function() { return nativeText(text); });
      };
      navigator.clipboard.write = function(items) {
        var p = origWrite ? origWrite(items) : Promise.reject(new Error('write unavailable'));
        return p.catch(function(e) {
          var item = items && items[0];
          if (!item) throw e;
          return nativeImage(item);
        });
      };
    } else {
      navigator.clipboard = {
        writeText: function(text) { return nativeText(text); },
        write: function(items) {
          var item = items && items[0];
          return item ? nativeImage(item) : Promise.reject(new Error('empty items'));
        }
      };
    }
  })();
  // UX：导出提示时机优化。
  // ① 抑制过早 toast：Trilium 在 worker 生成完导出文件后（picker+落盘之前）就经
  //   'trilium:ws-message' 事件派发 taskType='export'/type='taskSucceeded' 弹"导出成功完成"。
  //   本 hook 在 document start 注册（早于客户端 ws.ts 的监听），pending 期间对这条消息
  //   stopImmediatePropagation 精确抑制——按消息结构匹配（不依赖 i18n 文本），其他 taskType
  //   的 taskSucceeded（删除/导入等）不受影响。
  // ② 保存后真提示：__shellShowToast 自绘轻量 toast（成功/取消/失败）。
  window.__shellExportPending = false;
  window.addEventListener('trilium:ws-message', function(event) {
    try {
      if (!window.__shellExportPending) return;
      var msg = event.detail;
      if (msg && msg.taskType === 'export' && msg.type === 'taskSucceeded') {
        console.log('[SHELL-DL] suppressed premature export-success toast (taskId=' + msg.taskId + ')');
        event.stopImmediatePropagation();
      }
    } catch (e) {}
  });
  window.__shellShowToast = function(text, kind) {
    try {
      var el = document.createElement('div');
      el.textContent = text;
      var bg = '#323232';
      if (kind === 'error') bg = '#c62828';
      else if (kind === 'info') bg = '#455a64';
      el.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:99999;background:' + bg +
        ';color:#fff;padding:12px 18px;border-radius:8px;font-size:14px;font-family:sans-serif;' +
        'box-shadow:0 2px 12px rgba(0,0,0,.35);opacity:0;transition:opacity .3s;max-width:460px;' +
        'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;pointer-events:none;';
      document.body.appendChild(el);
      requestAnimationFrame(function() { el.style.opacity = '1'; });
      setTimeout(function() { el.style.opacity = '0'; setTimeout(function() { el.remove(); }, 400); }, 4000);
    } catch (e) {}
  };
  // 原生结果串（ok:<uri> / sandbox:<path> / cancelled / error:...）→ 用户可读提示
  window.__shellReportSave = function(result, logPrefix) {
    console.log(logPrefix + ' ' + result);
    if (result === 'cancelled') {
      window.__shellShowToast('导出已取消', 'info');
    } else if (result.indexOf('ok:') === 0 || result.indexOf('sandbox:') === 0) {
      var uri = result.substring(result.indexOf(':') + 1);
      var marker = 'currentUser/';
      var midx = uri.indexOf(marker);
      var pretty = midx >= 0 ? uri.substring(midx + marker.length) : uri;
      try { pretty = decodeURIComponent(pretty); } catch (e) {}
      window.__shellShowToast('已保存到 ' + pretty + (result.indexOf('sandbox:') === 0 ? '（应用目录）' : ''), 'ok');
    } else {
      window.__shellShowToast('导出失败：' + result, 'error');
    }
  };
  // 2.2 blob 下载降级：ArkWeb WebDownloadManager 不接管 blob: 锚点下载，
  // 拦截带 download 属性的 blob 锚点 click，读 blob 内容经原生落盘到 Download 目录
  (function patchBlobDownload() {
    var origClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
      try {
        var href = this.getAttribute('href') || '';
        var name = this.getAttribute('download');
        if (name && href.indexOf('blob:') === 0) {
          console.log('[SHELL-DL] intercept blob anchor download name=' + name);
          fetch(href).then(function(r) { return r.blob(); }).then(function(blob) { return blob.arrayBuffer(); }).then(function(ab) {
            var bytes = new Uint8Array(ab);
            var bin = '';
            var STEP = 32768;
            for (var i = 0; i < bytes.length; i += STEP) {
              bin += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + STEP, bytes.length)));
            }
            return window.__triliumNativeCall('saveBlobDownload', JSON.stringify({ filename: name, base64: btoa(bin) }));
          }).then(function(r) {
            window.__shellReportSave(r, '[SHELL-DL] native blob save');
          }).catch(function(e) {
            window.__shellReportSave('error:' + e, '[SHELL-DL] native blob save FAILED');
          });
          return;
        }
      } catch (e) { console.log('[SHELL-DL] intercept error ' + e); }
      origClick.call(this);
    };
  })();
  // 2.2 导出/附件下载接管：Trilium 的 open.download 用 location.href 导航触发下载，
  // ArkWeb 不把 SW 合成的 Content-Disposition 响应当下载（实测导航后白屏）。
  // 原生 onLoadIntercept 拦下导航后调此方法：fetch（走 SW→worker）→ blob → 原生落盘。
  window.__triliumShellDownload = function(url, fallbackName) {
    console.log('[SHELL-DL] shell download ' + url);
    window.__shellExportPending = true;
    var done = function() { window.__shellExportPending = false; };
    fetch(url).then(function(resp) {
      var cd = resp.headers.get('content-disposition') || '';
      var m = cd.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
      var name = m ? decodeURIComponent(m[1].replace(/"/g, '')) : fallbackName;
      return resp.blob().then(function(blob) { return [name, blob]; });
    }).then(function(nb) {
      console.log('[SHELL-DL] fetched blob name=' + nb[0] + ' size=' + nb[1].size);
      return nb[1].arrayBuffer().then(function(ab) {
        var bytes = new Uint8Array(ab);
        var bin = '';
        var STEP = 32768;
        for (var i = 0; i < bytes.length; i += STEP) {
          bin += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + STEP, bytes.length)));
        }
        return window.__triliumNativeCall('saveBlobDownload', JSON.stringify({ filename: nb[0], base64: btoa(bin) }));
      });
    }).then(function(r) {
      window.__shellReportSave(r, '[SHELL-DL] shell download saved');
      done();
    }).catch(function(e) {
      window.__shellReportSave('error:' + e, '[SHELL-DL] shell download FAILED');
      done();
    });
  };
})();`;

// main.js 传输层补丁前缀（local-bridge2.js 导出表：i = registerNativeHttpHandler）
const MAIN_JS_PATCH_PREFIX = `import { i as __triliumRegNH } from './local-bridge2.js';\n` +
  `if (typeof window.__triliumNativeHttp === 'function') { __triliumRegNH(window.__triliumNativeHttp); console.log('[ShellPatch] native http handler registered'); } else { console.log('[ShellPatch] WARNING: __triliumNativeHttp missing at main.js eval'); }\n`;

// 4.1 冷启动优化（polish-release）传输层补丁，不改 dist 源文件（与 NDK sw-handler 双侧一致）：
// src chunk：首个 consistency check 由 dbReady+4s 推迟到 +60s（小时级周期不变），
// 避开启动后首个交互窗口的 CPU/写库突发（实测 content hash 计算 449ms 在该任务里）。
// （worker 并行初始化补丁曾实测：WASM 编译与 2MB chunk 解析争用 CPU，净收益为 0，已移除。）
const SRC_CHUNK_PATH = '/assets/src-BqS_D0t5.js';
const CONSISTENCY_ANCHOR = 'setTimeout(_n(hc),4*1e3)';
const CONSISTENCY_PATCHED = 'setTimeout(_n(hc),6e4)';

// 命中补丁时返回替换后的文本，否则返回 null（调用方回退原内容）
function applyStartupPatch(path: string, origText: string): string | null {
  if (path === SRC_CHUNK_PATH) {
    if (!origText.includes(CONSISTENCY_ANCHOR)) {
      hilog.warn(DOMAIN, TAG, '[ShellPatch] consistency anchor missing (dist drift?), serve original');
      return null;
    }
    hilog.info(DOMAIN, TAG, '[ShellPatch] served src chunk with deferred first consistency check');
    return origText.replace(CONSISTENCY_ANCHOR, CONSISTENCY_PATCHED);
  }
  return null;
}

// 4.1 首屏骨架：不用 javaScriptOnDocumentStart 注入（实测第二个 ScriptItem 会让 onPageEnd
// 推迟 ~160ms，A/B 隔离复现），改为 ArkUI 原生遮罩（见 build() 内 splashOverlay），
// 在 Web 日志出现 'Standalone mode: listening' 或 10s 超时后移除，零 Web 加载路径开销。

// 3.3 验收自检：经 javaScriptProxy → @ohos.net.http 对真实服务器发一次 GET
const NH_SELFTEST_SCRIPT = `(async()=>{try{if(typeof window.__triliumNativeHttp!=='function'){console.log('[SHELL-SELFTEST] __triliumNativeHttp missing');return;}const r=await window.__triliumNativeHttp({method:'GET',url:'https://tm.xiyue999.cn/',headers:{}});console.log('[SHELL-SELFTEST] native http GET status='+r.status+' bodyLen='+((r.data!==undefined)?JSON.stringify(r.data).length:(r.body||'').length)+' ctype='+(r.headers?r.headers['content-type']:'?'));}catch(e){console.log('[SHELL-SELFTEST] native http ERROR '+e);}})();`;

// XHR 怪癖回归检查（spike 遗留：原生 scheme handler 直接应答时 XHR responseText 曾为空）。
// 正式链路下静态 XHR 经 SW→NDK handler、API XHR 经 SW→worker，均应正常拿到响应体。
const XHR_SELFTEST_SCRIPT = `(function(){try{const x=new XMLHttpRequest();x.open('GET','/manifest.webmanifest');x.onload=function(){console.log('[SHELL-SELFTEST][xhr-static] status='+x.status+' responseText.len='+x.responseText.length);};x.onerror=function(){console.log('[SHELL-SELFTEST][xhr-static] ERROR onerror');};x.send();}catch(e){console.log('[SHELL-SELFTEST][xhr-static] ERROR '+e);}})();`;

// 1.1 剪贴板实测：writeText / write(image/png ClipboardItem) 在 https://localhost 安全上下文下的行为
const CLIP_SELFTEST_SCRIPT = `(async()=>{
  const L = (m) => console.log('[SHELL-CLIP] ' + m);
  try {
    L('isSecureContext=' + window.isSecureContext +
      ' clipboard.write=' + (navigator.clipboard ? typeof navigator.clipboard.write : 'undefined') +
      ' writeText=' + (navigator.clipboard ? typeof navigator.clipboard.writeText : 'undefined') +
      ' ClipboardItem=' + (typeof ClipboardItem));
    try {
      await navigator.clipboard.writeText('trilium-shell-clip-test');
      L('writeText OK');
      try {
        const t = await navigator.clipboard.readText();
        L('readText OK match=' + (t === 'trilium-shell-clip-test'));
      } catch (e) { L('readText FAIL ' + e); }
    } catch (e) { L('writeText FAIL ' + e); }
    try {
      // 真实 PNG（dist 内 icon）走 ClipboardItem 路径，比 8x8 合成图更接近 Trilium 图片复制场景
      const blob = await (await fetch('/assets/icon.png')).blob();
      L('test image blob size=' + blob.size + ' type=' + blob.type);
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      L('write image/png OK');
    } catch (e) { L('write image/png FAIL ' + e); }
  } catch (e) { L('ERROR ' + e); }
})();`;

// 2.2 下载链路自检：blob 锚点触发 webview 下载（与 Trilium 导出 zip/markdown 同路径）
const DL_SELFTEST_SCRIPT = `(function(){
  try {
    const blob = new Blob(['trilium shell download test ' + new Date().toISOString()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'shell-download-test.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log('[SHELL-DL] blob anchor download triggered');
  } catch (e) { console.log('[SHELL-DL] ERROR ' + e); }
})();`;

// 2.2 真实导出闭环：建小测试笔记 → 用其 branchId 触发导出（全库导出 >30s 会撞 sw.ts
// LOCAL_FETCH 超时，小分支路径完全同构）→ 原生拦截落盘 → 清理测试笔记。
const EXPORT_TEST_SCRIPT = `(async()=>{
  const L = (m) => console.log('[SHELL-DL] ' + m);
  try {
    const H = { 'Content-Type': 'application/json' };
    if (window.glob && window.glob.csrfToken) H['x-csrf-token'] = window.glob.csrfToken;
    const cr = await fetch('/api/notes/root/children?target=into', { method: 'POST', headers: H,
      body: JSON.stringify({ title: 'shell-export-test', type: 'text', content: '<p>export test content shell-dl</p>' }) });
    const cj = await cr.json();
    const noteId = cj.note ? cj.note.noteId : null;
    const branchId = cj.branch ? cj.branch.branchId : null;
    L('created test note noteId=' + noteId + ' branchId=' + branchId);
    if (!branchId) return;
    location.href = '/api/branches/' + branchId + '/export/subtree/html/shellexport';
    setTimeout(async () => {
      try {
        const dr = await fetch('/api/notes/' + noteId + '?taskId=shell-dl-clean&last=true', { method: 'DELETE', headers: H });
        L('cleanup test note delete status=' + dr.status);
      } catch (e) { L('cleanup failed ' + e); }
    }, 20000);
  } catch (e) { L('ERROR ' + e); }
})();`;

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
  downloadDelegate: webview.WebDownloadDelegate = new webview.WebDownloadDelegate();
  @State showSplash: boolean = true;
  private cookieVerified: boolean = false;
  private hookScripts: Array<ScriptItem> = [
    { script: NH_HOOK_SCRIPT, scriptRules: ['*'] }
  ];

  aboutToAppear(): void {
    // 3.2 cookie：显式打开 cookie 接受（https://localhost 域）
    try {
      webview.WebCookieManager.putAcceptCookieEnabled(true);
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'putAcceptCookieEnabled failed: %{public}s', JSON.stringify(err));
    }
    // 2.1/2.2 下载导出：接管 webview 下载，落到用户 Download 目录（2in1 预授权沙箱路径，
    // 系统文件管理可见）；取不到时退回应用 filesDir
    this.setupDownloadDelegate();
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
    // 4.1 首屏骨架：10s 超时兜底移除（正常由 onConsole 'Standalone mode: listening' 触发）
    setTimeout(() => {
      if (this.showSplash) {
        this.showSplash = false;
      }
    }, 10000);
    // 3.4 键盘适配：改用 ArkWeb 原生避让（见 Web 组件 .keyboardAvoidMode），
    // 不再手工监听 avoidAreaChange 写 @State padding（动画期高频回调与 Web resize 互踢导致闪屏）
  }

  // 2.1/2.2 接入 WebDownloadManager（picker 方案）：onBeforeDownload 是同步流程，
  // 先下载到 cache 临时文件；onDownloadFinish 后异步弹系统保存位置选择器（picker），
  // 用户确认后写入授权 URI 并清理临时文件。
  downloadTmpMap: Map<string, string> = new Map();

  setupDownloadDelegate(): void {
    const cacheDir = getContext(this).cacheDir;
    this.downloadDelegate.onBeforeDownload((item: webview.WebDownloadItem) => {
      const name = item.getSuggestedFileName();
      const path = `${cacheDir}/dl-${item.getGuid()}-${name}`;
      this.downloadTmpMap.set(item.getGuid(), path);
      hilog.info(DOMAIN, TAG, '[download] start %{public}s -> %{public}s (tmp)', item.getGuid(), path);
      item.start(path);
    });
    this.downloadDelegate.onDownloadUpdated((item: webview.WebDownloadItem) => {
      hilog.info(DOMAIN, TAG, '[download] progress %{public}s %{public}d%%', item.getGuid(), item.getPercentComplete());
    });
    this.downloadDelegate.onDownloadFailed((item: webview.WebDownloadItem) => {
      const tmp = this.downloadTmpMap.get(item.getGuid());
      if (tmp) {
        this.downloadTmpMap.delete(item.getGuid());
        try {
          fs.unlink(tmp);
        } catch (err) {
          // 清理失败无碍
        }
      }
      hilog.error(DOMAIN, TAG, '[download] FAILED %{public}s error=%{public}d', item.getGuid(), item.getLastErrorCode());
    });
    this.downloadDelegate.onDownloadFinish((item: webview.WebDownloadItem) => {
      const tmp = this.downloadTmpMap.get(item.getGuid());
      const name = item.getSuggestedFileName();
      hilog.info(DOMAIN, TAG, '[download] FINISH %{public}s tmp=%{public}s', item.getGuid(), tmp ?? '?');
      if (!tmp) {
        return;
      }
      this.downloadTmpMap.delete(item.getGuid());
      (async () => {
        try {
          const stat = fs.statSync(tmp);
          const u8 = new Uint8Array(stat.size);
          const f = fs.openSync(tmp, fs.OpenMode.READ_ONLY);
          let off = 0;
          while (off < u8.length) {
            const chunk = new ArrayBuffer(Math.min(4 * 1024 * 1024, u8.length - off));
            const r = fs.readSync(f.fd, chunk);
            if (r <= 0) {
              throw new Error(`readSync short read ${r} at ${off}/${u8.length}`);
            }
            u8.set(new Uint8Array(chunk, 0, r), off);
            off += r;
          }
          fs.closeSync(f);
          const result = await this.httpBridge.saveWithPicker(name, u8.buffer as ArrayBuffer);
          hilog.info(DOMAIN, TAG, '[download] delegate download saved %{public}s', result);
          // UX：delegate（常规 HTTP 下载）路径同样给出保存结果提示
          this.controller.runJavaScript(
            `window.__shellReportSave(${JSON.stringify(result)}, '[SHELL-DL] delegate download saved');`);
          fs.unlink(tmp);
        } catch (err) {
          const be = err as BusinessError;
          hilog.error(DOMAIN, TAG, '[download] delegate save failed %{public}s:%{public}s',
            String(be.code), be.message ?? JSON.stringify(err));
        }
      })();
    });
    // 注册需在 Web 组件 attach 后进行（controller 未关联组件时报 17100001），见 onControllerAttached
  }

  registerDownloadDelegate(): void {
    try {
      webview.WebDownloadManager.setDownloadDelegate(this.downloadDelegate);
      this.controller.setDownloadDelegate(this.downloadDelegate);
      hilog.info(DOMAIN, TAG, '[download] delegate registered');
    } catch (err) {
      hilog.error(DOMAIN, TAG, '[download] register failed: %{public}s', JSON.stringify(err));
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
      // 4.1 冷启动补丁：首个 consistency check 推迟（与 NDK sw-handler 双侧一致）
      if (path === SRC_CHUNK_PATH) {
        const text = buffer.from(ab as ArrayBuffer).toString('utf-8');
        const patchedText = applyStartupPatch(path, text);
        if (patchedText !== null) {
          const patched = buffer.from(patchedText);
          ab = patched.buffer.slice(patched.byteOffset, patched.byteOffset + patched.length);
        }
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
    Stack() {
      Column() {
        Web({ src: ORIGIN + '/index.html', controller: this.controller })
          .onControllerAttached(() => {
            hilog.info(DOMAIN, TAG, 'onControllerAttached');
            this.setupSchemeHandler();
            this.httpBridge.setController(this.controller);
            this.httpBridge.setFilesDir(getContext(this).filesDir);
            this.httpBridge.setUiContext(getContext(this) as common.UIAbilityContext);
            this.registerDownloadDelegate();
          })
          .onPageBegin(() => {
            hilog.info(DOMAIN, TAG, 'onPageBegin');
          })
          .onPageEnd(() => {
            hilog.info(DOMAIN, TAG, 'onPageEnd');
            if (!this.cookieVerified) {
              this.cookieVerified = true;
              this.verifyCookies();
              // 3.3 自检：经原生网络栈的真实 GET；XHR 怪癖回归检查（无用户可见副作用，保留）
              setTimeout(() => {
                this.controller.runJavaScript(NH_SELFTEST_SCRIPT);
                this.controller.runJavaScript(XHR_SELFTEST_SCRIPT);
              }, 3000);
              // 1.1 剪贴板/2.2 下载自检已验证通过，注入禁用：
              // CLIP 每次启动覆盖系统剪贴板内容、DL 每次启动弹 picker，均有用户可见副作用。
              // 如需重跑，临时恢复此注入即可（CLIP_SELFTEST_SCRIPT / DL_SELFTEST_SCRIPT 常量保留）。
              // setTimeout(() => {
              //   this.controller.runJavaScript(CLIP_SELFTEST_SCRIPT);
              //   this.controller.runJavaScript(DL_SELFTEST_SCRIPT);
              // }, 6000);
              // 2.2 真实导出闭环已验证通过（picker 方案 + 提示时机优化：抑制过早 toast、
              // 保存/取消结果提示均已实测），注入禁用：该脚本每次启动会在用户真实库里
              // 创建/删除测试笔记并产生同步变更。如需重跑，临时恢复此注入即可。
              // setTimeout(() => {
              //   this.controller.runJavaScript(EXPORT_TEST_SCRIPT);
              // }, 12000);
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
              const msg = event.message.getMessage();
              hilog.info(DOMAIN, TAG, '[web:%{public}d] %{public}s',
                event.message.getMessageLevel(), msg);
              // 4.1 首屏骨架：UI 连上 worker（即可交互）时移除原生遮罩
              if (this.showSplash && msg.includes('Standalone mode: listening')) {
                this.showSplash = false;
              }
            }
            return false;
          })
        .onErrorReceive((event) => {
          if (event) {
            hilog.error(DOMAIN, TAG, '[web-err] %{public}s code=%{public}d %{public}s',
              event.request.getRequestUrl(), event.error.getErrorCode(), event.error.getErrorInfo());
          }
        })
        .onLoadIntercept((event) => {
          // 2.2 下载类导航拦截：ArkWeb 不把 SW 合成的 Content-Disposition 响应当下载
          //（实测 location.href 到导出端点后白屏），拦下后改走 __triliumShellDownload 落盘
          if (event) {
            const url = event.data.getRequestUrl();
            const dlMatch = url.match(/^https:\/\/localhost(\/api\/(?:branches\/[^/]+\/export\/|attachments\/[^/]+\/download|notes\/[^/]+\/download|notes\/[^/]+\/revisions\/[^/]+\/download).*)$/);
            if (dlMatch) {
              const path = dlMatch[1];
              let fallback = 'trilium-download';
              if (path.includes('/export/')) {
                const parts = path.split('/');
                fallback = `trilium-export.${parts.includes('markdown') ? 'md' : 'zip'}`;
              }
              hilog.info(DOMAIN, TAG, '[download] intercept navigation %{public}s', url);
              this.controller.runJavaScript(
                `window.__triliumShellDownload(${JSON.stringify(path)}, ${JSON.stringify(fallback)});`);
              return true;
            }
          }
          return false;
        })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .fileAccess(true)
        .onlineImageAccess(true)
        .javaScriptOnDocumentStart(this.hookScripts)
        .javaScriptProxy({
          object: this.httpBridge,
          name: 'triliumNative',
          methodList: ['httpRequest', 'pasteboardSetText', 'pasteboardSetImagePng', 'saveBlobDownload'],
          asyncMethodList: [],
          controller: this.controller
        })
        .width('100%')
        .layoutWeight(1)
        // 3.4 键盘适配：RESIZE_VISUAL 只缩 visual viewport，不触发 layout 重排，
        // 输入框不被遮挡且页面不抖（手工 avoidAreaChange+padding 方案在手机上实测闪屏，已移除）
        .keyboardAvoidMode(WebKeyboardAvoidMode.RESIZE_VISUAL)
      }
      .width('100%')
      .height('100%')

      // 4.1 首屏骨架（ArkUI 原生遮罩）：覆盖 ArkWeb 内核初始化→UI 连上 worker 的白屏窗口，
      // onConsole 见 'Standalone mode: listening' 时移除，10s 超时兜底（见 aboutToAppear）
      if (this.showSplash) {
        Column() {
          Column() {
            Text('T')
              .fontSize(24)
              .fontWeight(FontWeight.Bold)
              .fontColor('#ffffff')
              .textAlign(TextAlign.Center)
              .width(44)
              .height(44)
              .borderRadius(11)
              .backgroundColor('#3a7d44')
            Text('Trilium')
              .fontSize(14)
              .fontColor('#c8c8cc')
              .letterSpacing(2)
              .margin({ top: 16 })
            LoadingProgress()
              .width(28)
              .height(28)
              .color('#c8c8cc')
              .margin({ top: 18 })
          }
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
        .backgroundColor('#1e1e22')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#1e1e22')
  }
}

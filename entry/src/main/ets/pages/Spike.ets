/*
 * ArkWeb shell spike — go/no-go 技术验证页面（openspec change arkweb-shell-mvp 2.1/2.2/2.3/2.4/2.6）
 * 全部 spike 代码隔离在本文件内，不影响正式壳结构。
 *
 * 方案：注册 https 的 WebSchemeHandler，拦截 https://localhost/* 全部请求：
 *  - /api/*        -> 原生回显（验证 GET/POST 拦截与 POST body 读取）
 *  - 其余路径       -> rawfile/dist 静态文件映射（渲染 Trilium standalone PWA）
 */

import { webview, WebNetErrorList } from '@kit.ArkWeb';
import { buffer } from '@kit.ArkTS';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';

const TAG = 'SPIKE';
const DOMAIN = 0x0001;
const ORIGIN = 'https://localhost';

function spikeLog(line: string): void {
  hilog.info(DOMAIN, TAG, '%{public}s', line);
}

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
    mime === 'application/javascript' || mime === 'application/manifest+json' ||
    mime === 'image/svg+xml' || mime === 'application/xml';
}

@Entry
@Component
struct Spike {
  controller: webview.WebviewController = new webview.WebviewController();
  schemeHandler: webview.WebSchemeHandler = new webview.WebSchemeHandler();
  @State logText: string = '[spike] page created';

  appendLog(line: string): void {
    spikeLog(line);
    if (this.logText.length > 6000) {
      this.logText = this.logText.substring(this.logText.length - 4000);
    }
    this.logText += '\n' + line;
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
    // dist/_headers 要求 COOP；同源 fetch 不需要 CORS，但加上无害，方便后续跨源调试
    response.setHeaderByName('Cross-Origin-Opener-Policy', 'same-origin', false);
    response.setHeaderByName('Cross-Origin-Embedder-Policy', 'require-corp', false);
    response.setHeaderByName('Access-Control-Allow-Origin', '*', false);
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
      this.appendLog(`[handler] sendResponse error: ${JSON.stringify(err)}`);
    }
  }

  // ---- /api/* 回显：验证 GET/POST 拦截与 POST body 读取（任务 2.3/2.4）----
  handleApi(request: webview.WebSchemeHandlerRequest, resourceHandler: webview.WebResourceHandler): void {
    const url = request.getRequestUrl();
    const method = request.getRequestMethod();
    const stream = request.getHttpBodyStream();
    this.appendLog(`[api] ${method} ${url} stream=${stream ? 'yes' : 'no'}`);

    const echo = (hasBody: boolean, bodyBytes: number, bodyText: string, note: string): void => {
      const json = JSON.stringify({
        echo: true, method: method, url: url,
        hasBody: hasBody, bodyBytes: bodyBytes, body: bodyText, note: note
      });
      this.appendLog(`[api] echo ${method} hasBody=${hasBody} bytes=${bodyBytes} note=${note}`);
      const response = this.buildResponse(200, 'OK', 'application/json');
      const buf = buffer.from(json);
      this.sendResponse(resourceHandler, response, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
    };

    if (!stream) {
      echo(false, 0, '', 'no http body stream');
      return;
    }

    stream.initialize().then(async () => {
      try {
        const size = stream.getSize();
        const chunked = stream.isChunked();
        const chunks: Uint8Array[] = [];
        let total = 0;
        if (chunked) {
          // 分块传输：循环读到 EOF
          while (!stream.isEof()) {
            const piece = await stream.read(64 * 1024);
            if (piece.byteLength === 0) {
              break;
            }
            chunks.push(new Uint8Array(piece));
            total += piece.byteLength;
          }
        } else if (size > 0) {
          const piece = await stream.read(size);
          chunks.push(new Uint8Array(piece));
          total = piece.byteLength;
        }
        const merged = new Uint8Array(total);
        let off = 0;
        for (const c of chunks) {
          merged.set(c, off);
          off += c.byteLength;
        }
        const bodyText = buffer.from(merged.buffer).toString('utf-8');
        echo(true, total, bodyText, `stream size=${size} chunked=${chunked}`);
      } catch (err) {
        echo(true, -1, '', `read error: ${JSON.stringify(err)}`);
      }
    }).catch((err: BusinessError) => {
      echo(true, -1, '', `initialize error: ${err.code} ${err.message}`);
    });
  }

  // ---- rawfile/dist 静态文件映射（任务 2.1/2.2）----
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
    try {
      path = decodeURI(path);
    } catch (err) {
      // 保留原样
    }
    if (path === '' || path === '/') {
      path = '/index.html';
    }
    if (path.includes('..')) {
      const response = this.buildResponse(403, 'Forbidden', 'text/plain');
      const buf = buffer.from('forbidden');
      this.sendResponse(resourceHandler, response, buf.buffer);
      return;
    }
    const rawPath = 'dist' + path;
    try {
      const data: Uint8Array = getContext(this).resourceManager.getRawFileContentSync(rawPath);
      const response = this.buildResponse(200, 'OK', mimeFor(path));
      const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
      this.sendResponse(resourceHandler, response, ab);
    } catch (err) {
      this.appendLog(`[dist] 404 ${rawPath}`);
      const response = this.buildResponse(404, 'Not Found', 'text/plain');
      const buf = buffer.from('not found: ' + rawPath);
      this.sendResponse(resourceHandler, response, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length));
    }
  }

  setupSchemeHandler(): void {
    this.schemeHandler.onRequestStart(
      (request: webview.WebSchemeHandlerRequest, resourceHandler: webview.WebResourceHandler) => {
        const url = request.getRequestUrl();
        try {
          if (url.startsWith(ORIGIN + '/api/')) {
            this.handleApi(request, resourceHandler);
            return true;
          }
          if (url.startsWith(ORIGIN)) {
            this.serveDist(url, resourceHandler);
            return true;
          }
          this.appendLog(`[handler] bypass ${request.getRequestMethod()} ${url}`);
          return false;
        } catch (err) {
          this.appendLog(`[handler] onRequestStart error: ${JSON.stringify(err)}`);
          return false;
        }
      });
    this.schemeHandler.onRequestStop((request: webview.WebSchemeHandlerRequest) => {
      spikeLog(`[handler] onRequestStop ${request.getRequestUrl()}`);
    });
    this.controller.setWebSchemeHandler('https', this.schemeHandler);
    this.appendLog('[spike] setWebSchemeHandler(https) done');
  }

  runJs(name: string, script: string): void {
    try {
      this.controller.runJavaScript(script, (err, result) => {
        if (err) {
          this.appendLog(`[js:${name}] runJavaScript error: ${JSON.stringify(err)}`);
        } else {
          spikeLog(`[js:${name}] ret=${result}`);
        }
      });
    } catch (err) {
      this.appendLog(`[js:${name}] throw: ${JSON.stringify(err)}`);
    }
  }

  // 注入的 JS 统一通过 console.log('[SPIKE-RESULT]...') 回传，由 onConsole 捕获
  testFetchPost(): void {
    this.runJs('fetch-post',
      `(async()=>{try{const r=await fetch('/api/spike-echo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({hello:'spike-fetch',ts:123})});const t=await r.text();console.log('[SPIKE-RESULT][fetch-POST] status='+r.status+' body='+t);}catch(e){console.log('[SPIKE-RESULT][fetch-POST] ERROR '+e);}})();`);
  }

  testXhrPost(): void {
    this.runJs('xhr-post',
      `(function(){try{const x=new XMLHttpRequest();x.open('POST','/api/spike-echo');x.setRequestHeader('Content-Type','application/json');x.onload=function(){console.log('[SPIKE-RESULT][xhr-POST] status='+x.status+' body='+x.responseText);};x.onerror=function(){console.log('[SPIKE-RESULT][xhr-POST] ERROR onerror');};x.send(JSON.stringify({hello:'spike-xhr',ts:456}));}catch(e){console.log('[SPIKE-RESULT][xhr-POST] ERROR '+e);}})();`);
  }

  testGet(): void {
    this.runJs('fetch-get',
      `(async()=>{try{const r=await fetch('/api/spike-echo?probe=get');const t=await r.text();console.log('[SPIKE-RESULT][fetch-GET] status='+r.status+' body='+t);}catch(e){console.log('[SPIKE-RESULT][fetch-GET] ERROR '+e);}})();`);
  }

  testSw(): void {
    this.runJs('sw',
      `(async()=>{try{if(!('serviceWorker' in navigator)){console.log('[SPIKE-RESULT][SW] not supported');return;}let reg=null;try{reg=await navigator.serviceWorker.register('/sw.js');console.log('[SPIKE-RESULT][SW] register ok scope='+reg.scope+' installing='+(!!reg.installing)+' waiting='+(!!reg.waiting)+' active='+(reg.active?reg.active.state:'null'));}catch(e){console.log('[SPIKE-RESULT][SW] register FAILED: '+e);}const regs=await navigator.serviceWorker.getRegistrations();console.log('[SPIKE-RESULT][SW] regs='+regs.length+' controller='+(navigator.serviceWorker.controller?navigator.serviceWorker.controller.state:'null'));}catch(e){console.log('[SPIKE-RESULT][SW] ERROR '+e);}})();`);
  }

  testOpfs(): void {
    this.runJs('opfs',
      `(async()=>{try{const root=await navigator.storage.getDirectory();let prev=null;try{const f=await root.getFileHandle('spike-opfs.txt');prev=await (await f.getFile()).text();}catch(e){}const now=new Date().toISOString();const fh=await root.getFileHandle('spike-opfs.txt',{create:true});const w=await fh.createWritable();await w.write(now);await w.close();const back=await (await (await root.getFileHandle('spike-opfs.txt')).getFile()).text();console.log('[SPIKE-RESULT][OPFS] OK prev='+prev+' wrote='+now+' readback='+back+' match='+(back===now));}catch(e){console.log('[SPIKE-RESULT][OPFS] FAILED: '+e);}})();`);
  }

  testUa(): void {
    this.runJs('ua', `console.log('[SPIKE-RESULT][UA] '+navigator.userAgent);`);
  }

  // ---- 任务 2.9：性能探针 ----
  // 可交互探针：onPageEnd 后立即注入，轮询 DOM 出现实质内容（首个屏幕渲染完成），
  // 记录 web 侧 performance.now()（相对 navigationStart 的毫秒数）
  testInteractive(): void {
    this.runJs('tti',
      `(function(){let done=false;const iv=setInterval(()=>{try{if(done)return;const b=document.body;if(b&&b.querySelectorAll('*').length>30){done=true;clearInterval(iv);console.log('[SPIKE-PERF] interactive performance.now()='+Math.round(performance.now())+' elems='+b.querySelectorAll('*').length+' text="'+b.innerText.replace(/\\s+/g,' ').slice(0,60)+'"');}}catch(e){}},100);setTimeout(()=>{if(!done){done=true;clearInterval(iv);console.log('[SPIKE-PERF] interactive TIMEOUT 30s');}},30000);})();`);
  }

  // 存储探针：storage.estimate + OPFS 根目录/一级子目录文件清单（定位 trilium.db 实际大小）
  testStorage(): void {
    this.runJs('storage',
      `(async()=>{try{const est=await navigator.storage.estimate();console.log('[SPIKE-PERF][STORAGE] usage='+est.usage+' quota='+est.quota);const root=await navigator.storage.getDirectory();const walk=async(dir,prefix,depth)=>{for await(const [name,handle] of dir.entries()){if(handle.kind==='file'){const f=await handle.getFile();console.log('[SPIKE-PERF][OPFS] file '+prefix+name+' size='+f.size);}else if(depth<2){await walk(await dir.getDirectoryHandle(name),prefix+name+'/',depth+1);}}};await walk(root,'',0);}catch(e){console.log('[SPIKE-PERF][STORAGE] ERROR '+e);}})();`);
  }

  testDom(): void {
    this.runJs('dom',
      `(function(){try{const b=document.body;const app=document.querySelector('#trilium-app');const cs=getComputedStyle(b);console.log('[SPIKE-RESULT][DOM] title='+document.title+' bodyKids='+b.children.length+' htmlLen='+b.innerHTML.length+' textLen='+b.innerText.length+' bg='+cs.backgroundColor+' appKids='+(app?app.children.length:'null')+' isolated='+crossOriginIsolated+' SAB='+(typeof SharedArrayBuffer)+' vis='+document.visibilityState);const t=b.innerText.replace(/\\s+/g,' ').slice(0,150);console.log('[SPIKE-RESULT][DOM] text="'+t+'"');}catch(e){console.log('[SPIKE-RESULT][DOM] ERROR '+e);}})();`);
  }

  runAllTests(): void {
    this.appendLog('[spike] ==== run all tests ====');
    this.testUa();
    this.testDom();
    this.testFetchPost();
    this.testXhrPost();
    this.testGet();
    this.testSw();
    this.testOpfs();
  }

  build() {
    Column() {
      Scroll() {
        Text(this.logText)
          .fontSize(11)
          .fontColor(0x333333)
          .width('100%')
          .textAlign(TextAlign.Start)
      }
      .height(170)
      .width('100%')
      .backgroundColor(0xF0F0F0)
      .padding(4)

      Row() {
        Button('ALL').fontSize(11).onClick(() => this.runAllTests())
        Button('POST').fontSize(11).onClick(() => {
          this.testFetchPost();
          this.testXhrPost();
        })
        Button('GET').fontSize(11).onClick(() => this.testGet())
        Button('SW').fontSize(11).onClick(() => this.testSw())
        Button('OPFS').fontSize(11).onClick(() => this.testOpfs())
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly)
      .padding(2)

      Web({ src: ORIGIN + '/index.html', controller: this.controller })
        .onControllerAttached(() => {
          this.appendLog('[spike] onControllerAttached');
          this.setupSchemeHandler();
        })
        .onPageBegin(() => {
          this.appendLog('[spike] onPageBegin');
        })
        .onPageEnd(() => {
          this.appendLog('[spike] onPageEnd -> TTI probe now, auto tests in 5s');
          this.testInteractive();
          setTimeout(() => this.runAllTests(), 5000);
          setTimeout(() => this.testStorage(), 8000);
        })
        .onConsole((event) => {
          if (event) {
            const msg = event.message.getMessage();
            const lvl = event.message.getMessageLevel();
            this.appendLog(`[web:${lvl}] ${msg}`);
          }
          return false;
        })
        .onErrorReceive((event) => {
          if (event) {
            this.appendLog(`[web-err] ${event.request.getRequestUrl()} code=${event.error.getErrorCode()} ${event.error.getErrorInfo()}`);
          }
        })
        .javaScriptAccess(true)
        .domStorageAccess(true)
        .fileAccess(true)
        .onlineImageAccess(true)
        .layoutWeight(1)
        .width('100%')
    }
    .width('100%')
    .height('100%')
  }
}

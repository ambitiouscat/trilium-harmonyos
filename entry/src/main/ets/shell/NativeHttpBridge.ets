/*
 * Trilium 壳 — 出站 HTTP 桥（任务 3.3）
 *
 * 对接 Trilium standalone 的 registerNativeHttpHandler 协议：
 *   worker (BridgedRequestProvider) --HTTP_REQUEST--> 页面 local-bridge
 *     --> window.__triliumNativeHttp(request)  [javaScriptOnDocumentStart 注入]
 *       --> triliumNative.httpRequest(id, json)  [本类，javaScriptProxy]
 *         --> @ohos.net.http 真实网络栈
 *       <-- runJavaScript 回调 window.__triliumNhResolve / __triliumNhReject
 *     <-- Promise 解析为 { status, headers, data|body }（data/body 分离，防大 blob 二次解析 OOM）
 *   worker <--HTTP_RESPONSE-- 页面 local-bridge
 *
 * data/body 分离约定（沿用 local-bridge.ts 44-64 行注释的设计）：
 *   - JSON 响应：页面 hook 先 JSON.parse 一次成 data（structured clone 进 worker，worker 不再 parse）
 *   - 非 JSON 文本 / 错误体：body 原样字符串
 *   - responseType=arraybuffer：body 为 base64（payload.base64=true，hook 跳过 JSON.parse）
 */

import { http } from '@kit.NetworkKit';
import { webview } from '@kit.ArkWeb';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { buffer } from '@kit.ArkTS';

const TAG = 'SHELL_HTTP';
const DOMAIN = 0x0001;

// 分段传输参数：>2MB 的响应切 1MB 片回传
const CHUNK_THRESHOLD = 2 * 1024 * 1024;
const CHUNK_SIZE = 1024 * 1024;

interface BridgeRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  responseType?: string;
}

interface BridgeResponsePayload {
  status: number;
  headers: Record<string, string>;
  body: string;
  base64: boolean;
}

function toRequestMethod(method: string): http.RequestMethod {
  switch (method.toUpperCase()) {
    case 'POST': return http.RequestMethod.POST;
    case 'PUT': return http.RequestMethod.PUT;
    case 'DELETE': return http.RequestMethod.DELETE;
    case 'HEAD': return http.RequestMethod.HEAD;
    case 'OPTIONS': return http.RequestMethod.OPTIONS;
    case 'TRACE': return http.RequestMethod.TRACE;
    case 'CONNECT': return http.RequestMethod.CONNECT;
    default: return http.RequestMethod.GET;
  }
}

export class NativeHttpBridge {
  private controller: webview.WebviewController | null = null;

  setController(controller: webview.WebviewController): void {
    this.controller = controller;
  }

  /**
   * javaScriptProxy 暴露方法（name='triliumNative'）。
   * 同步返回，后台执行请求，完成后经 runJavaScript 回调页面。
   */
  httpRequest(id: string, requestJson: string): void {
    let req: BridgeRequest;
    try {
      req = JSON.parse(requestJson) as BridgeRequest;
    } catch (err) {
      this.deliverReject(id, `bad request json: ${JSON.stringify(err)}`);
      return;
    }
    hilog.info(DOMAIN, TAG, 'HTTP_REQUEST %{public}s %{public}s %{public}s bodyLen=%{public}d hasCookie=%{public}s',
      id, req.method, req.url, req.body ? req.body.length : 0,
      (req.headers && (req.headers['Cookie'] || req.headers['cookie'])) ? 'yes' : 'no');

    const isBinary = req.responseType === 'arraybuffer';
    const httpRequest = http.createHttp();
    const options: http.HttpRequestOptions = {
      method: toRequestMethod(req.method),
      header: req.headers,
      expectDataType: isBinary ? http.HttpDataType.ARRAY_BUFFER : http.HttpDataType.STRING,
      usingCache: false,
      readTimeout: 120000,
      connectTimeout: 60000,
      // sync 大 blob 批次远超 5MB 默认上限
      maxLimit: 200 * 1024 * 1024
    };
    if (req.body !== undefined && req.body !== null) {
      options.extraData = req.body;
    }

    // syncMaxBlobContentSize 传输补丁（OOM 修复之二）：
    // 本壳非 Capacitor，setup 时该 option 存为 0（无限制），服务器会把大 blob 内联进
    // /api/sync/changed 的响应（实测单响应 ~121MB 直接 OOM）。Trilium 协议中该值由客户端
    // 以 URL 参数带上（core sync.ts fetchChangesChunk），但 option 不允许客户端写
    // （PUT /api/options 返回 400 "not allowed option to change"，ALLOWED_OPTIONS 白名单）。
    // 因此在桥层出站时补齐 maxBlobContentSize=20MB（MOBILE_SYNC_MAX_BLOB_CONTENT_SIZE），
    // 服务器对超限 blob 改发 stub，按需再取——与改库等效且不依赖 becca/初始化状态。
    let url = req.url;
    if (url.includes('/api/sync/changed') && !url.includes('maxBlobContentSize=')) {
      url += (url.includes('?') ? '&' : '?') + 'maxBlobContentSize=20971520';
      hilog.info(DOMAIN, TAG, 'blob cap 20MB applied to sync-changed request');
    }

    httpRequest.request(url, options).then((resp: http.HttpResponse) => {
      // 头全部小写化，worker 侧按 headers["set-cookie"] 取 cookie jar
      const headers: Record<string, string> = {};
      const rawHeader = resp.header as Record<string, Object>;
      if (rawHeader) {
        Object.keys(rawHeader).forEach((key: string) => {
          const value = rawHeader[key];
          headers[key.toLowerCase()] = typeof value === 'string' ? value : JSON.stringify(value);
        });
      }
      // @ohos.net.http 把 Set-Cookie 放进独立的 cookies 字段（不在 resp.header 里），
      // 且格式是 Netscape cookie 文件行（#HttpOnly_domain\tflag\tpath\tsecure\texpires\tname\tvalue），
      // 不是 Set-Cookie 头格式——必须解析出 name=value 补回 headers['set-cookie']，
      // worker 的 cookie jar 才能吸收会话 cookie（bridged_request_provider.ts:98）
      if (resp.cookies && resp.cookies.length > 0) {
        const pairs: string[] = [];
        resp.cookies.split('\n').forEach((line: string) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return;
          }
          const parts = trimmed.split('\t');
          if (parts.length >= 7) {
            pairs.push(`${parts[5]}=${parts[6]}`);
          }
        });
        if (pairs.length > 0) {
          headers['set-cookie'] = pairs.join('; ');
        }
      }
      let body = '';
      let base64 = false;
      if (isBinary && resp.result instanceof ArrayBuffer) {
        body = buffer.from(resp.result as ArrayBuffer).toString('base64');
        base64 = true;
      } else if (typeof resp.result === 'string') {
        body = resp.result;
      } else if (resp.result !== undefined && resp.result !== null) {
        body = JSON.stringify(resp.result);
      }
      hilog.info(DOMAIN, TAG, 'HTTP_RESPONSE %{public}s status=%{public}d bytes=%{public}d cookiesLen=%{public}d setCookieInHeaders=%{public}s',
        id, resp.responseCode, body.length, resp.cookies ? resp.cookies.length : -1,
        headers['set-cookie'] ? 'yes' : 'no');
      const payload: BridgeResponsePayload = {
        status: resp.responseCode,
        headers: headers,
        body: body,
        base64: base64
      };
      this.deliverResolve(id, JSON.stringify(payload));
      httpRequest.destroy();
    }).catch((err: Object) => {
      hilog.error(DOMAIN, TAG, 'HTTP_ERROR %{public}s %{public}s', id, JSON.stringify(err));
      this.deliverReject(id, `native http failed: ${JSON.stringify(err)}`);
      httpRequest.destroy();
    });
  }

  // 分段传输阈值/片长：payload 超阈值时切片经多次 runJavaScript 回传，
  // 保证 ArkTS 侧除 payloadStr 本身外不再分配超大字符串（OOM 修复：
  // 单次 runJavaScript 携带 ~121MB 字符串时 SharedHeap::AllocateHugeObject 失败）
  private deliverResolve(id: string, payloadStr: string): void {
    const idArg = JSON.stringify(id);
    if (payloadStr.length <= CHUNK_THRESHOLD) {
      this.runOnPage(`window.__triliumNhResolve(${idArg}, ${JSON.stringify(payloadStr)});`);
      return;
    }
    const totalChunks = Math.ceil(payloadStr.length / CHUNK_SIZE);
    hilog.info(DOMAIN, TAG, 'chunked deliver %{public}s totalBytes=%{public}d chunks=%{public}d',
      id, payloadStr.length, totalChunks);
    this.runOnPage(`window.__triliumNhChunkStart(${idArg});`);
    let offset = 0;
    let index = 0;
    while (offset < payloadStr.length) {
      const end = Math.min(offset + CHUNK_SIZE, payloadStr.length);
      const chunk = payloadStr.substring(offset, end);
      this.runOnPage(`window.__triliumNhChunk(${idArg}, ${JSON.stringify(chunk)});`);
      offset = end;
      index++;
    }
    this.runOnPage(`window.__triliumNhChunkEnd(${idArg});`);
    hilog.info(DOMAIN, TAG, 'chunked deliver done %{public}s chunks=%{public}d', id, index);
  }

  private deliverReject(id: string, message: string): void {
    this.runOnPage(`window.__triliumNhReject(${JSON.stringify(id)}, ${JSON.stringify(message)});`);
  }

  private runOnPage(script: string): void {
    try {
      this.controller?.runJavaScript(script);
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'deliver failed: %{public}s', JSON.stringify(err));
    }
  }
}

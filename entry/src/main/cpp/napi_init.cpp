/*
 * Trilium 壳 — NDK 部分
 * 通过 OH_ArkWebServiceWorker_SetSchemeHandler 拦截 ServiceWorker 发出的 https 请求，
 * 从 rawfile/dist 提供静态文件。ArkTS 的 setWebSchemeHandler 只覆盖 Web 组件自身的请求，
 * SW 的请求（含 sw.js 注册脚本拉取）必须走此 NDK 接口。
 */

#include "napi/native_api.h"
#include "web/arkweb_scheme_handler.h"
#include "rawfile/raw_file_manager.h"
#include "rawfile/raw_file.h"
#include "hilog/log.h"

#include <cstdlib>
#include <cstring>
#include <string>
#include <vector>
#include <pthread.h>

#define LOG_DOMAIN 0x0001
#define LOG_TAG "SPIKE_NATIVE"

static NativeResourceManager *g_resMgr = nullptr;
static const char *kOrigin = "https://localhost";

// main.js 传输层补丁前缀（与 Shell.ets 的 MAIN_JS_PATCH_PREFIX 保持一致；
// local-bridge2.js 导出表中 i = registerNativeHttpHandler）
static const char *kMainJsPatch =
    "import { i as __triliumRegNH } from './local-bridge2.js';\n"
    "if (typeof window.__triliumNativeHttp === 'function') { __triliumRegNH(window.__triliumNativeHttp); console.log('[ShellPatch] native http handler registered'); } else { console.log('[ShellPatch] WARNING: __triliumNativeHttp missing at main.js eval'); }\n";

// 4.1 冷启动优化（polish-release）传输层补丁，不改 dist 源文件：
// src chunk：首个 consistency check 由 dbReady+4s 推迟到 +60s（小时级周期不变），
// 避开启动后首个交互窗口的 CPU/写库突发（实测 content hash 计算 449ms 在该任务里）。
// （worker 并行初始化补丁曾实测：WASM 编译与 2MB chunk 解析争用 CPU，净收益为 0，已移除。）
static const char *kSrcChunkPath = "/assets/src-BqS_D0t5.js";
static const char *kConsistencyAnchor = "setTimeout(_n(hc),4*1e3)";
static const char *kConsistencyPatched = "setTimeout(_n(hc),6e4)";

// 对读出的 dist JS 应用 4.1 补丁；命中时替换 buf/size（释放旧缓冲），返回 true。
static bool ApplyStartupPatches(const std::string &path, uint8_t *&buf, long &size) {
    if (path == kSrcChunkPath) {
        std::string orig((const char *)buf, (size_t)size);
        auto pos = orig.find(kConsistencyAnchor);
        if (pos == std::string::npos) {
            OH_LOG_WARN(LOG_APP, "[ShellPatch] consistency anchor missing (dist drift?), serve original");
            return false;
        }
        orig.replace(pos, strlen(kConsistencyAnchor), kConsistencyPatched);
        uint8_t *nb = (uint8_t *)malloc(orig.size());
        memcpy(nb, orig.data(), orig.size());
        free(buf);
        buf = nb;
        size = (long)orig.size();
        OH_LOG_INFO(LOG_APP, "[ShellPatch] served src chunk with deferred first consistency check");
        return true;
    }
    return false;
}

// 生命周期：request/handler/response/body 缓冲全部延到 OnRequestStop 里释放，
// 在 OnRequestStart 里提前释放会让 IO 线程 UAF 崩溃（实测 SIGSEGV）。
struct PendingReq {
    ArkWeb_ResourceRequest *req;
    const ArkWeb_ResourceHandler *handler;
    ArkWeb_Response *resp;
    uint8_t *buf;
};

static std::vector<PendingReq *> g_pending;
static pthread_mutex_t g_pendingMutex = PTHREAD_MUTEX_INITIALIZER;

static void TrackPending(PendingReq *p) {
    pthread_mutex_lock(&g_pendingMutex);
    g_pending.push_back(p);
    pthread_mutex_unlock(&g_pendingMutex);
}

static std::string MimeFor(const std::string &path) {
    auto dot = path.find_last_of('.');
    if (dot == std::string::npos) {
        return "application/octet-stream";
    }
    std::string ext = path.substr(dot + 1);
    for (auto &c : ext) {
        c = (char)tolower(c);
    }
    if (ext == "html") return "text/html";
    if (ext == "js" || ext == "mjs") return "text/javascript";
    if (ext == "css") return "text/css";
    if (ext == "json" || ext == "map") return "application/json";
    if (ext == "webmanifest") return "application/manifest+json";
    if (ext == "wasm") return "application/wasm";
    if (ext == "png") return "image/png";
    if (ext == "jpg" || ext == "jpeg") return "image/jpeg";
    if (ext == "gif") return "image/gif";
    if (ext == "svg") return "image/svg+xml";
    if (ext == "ico") return "image/x-icon";
    if (ext == "woff") return "font/woff";
    if (ext == "woff2") return "font/woff2";
    if (ext == "ttf") return "font/ttf";
    if (ext == "txt") return "text/plain";
    if (ext == "xml") return "application/xml";
    if (ext == "pdf") return "application/pdf";
    return "application/octet-stream";
}

static void SetCommonHeaders(ArkWeb_Response *resp) {
    OH_ArkWebResponse_SetError(resp, ARKWEB_NET_OK);
    OH_ArkWebResponse_SetHeaderByName(resp, "Cross-Origin-Opener-Policy", "same-origin", false);
    OH_ArkWebResponse_SetHeaderByName(resp, "Cross-Origin-Embedder-Policy", "require-corp", false);
    OH_ArkWebResponse_SetHeaderByName(resp, "Access-Control-Allow-Origin", "*", false);
    OH_ArkWebResponse_SetHeaderByName(resp, "Cache-Control", "no-cache", false);
}

static void OnSwRequestStart(const ArkWeb_SchemeHandler *schemeHandler,
                             ArkWeb_ResourceRequest *resourceRequest,
                             const ArkWeb_ResourceHandler *resourceHandler,
                             bool *intercept) {
    char *url = nullptr;
    OH_ArkWebResourceRequest_GetUrl(resourceRequest, &url);
    std::string u = url ? url : "";
    if (url) {
        OH_ArkWeb_ReleaseString(url);
    }

    if (u.rfind(kOrigin, 0) != 0 || g_resMgr == nullptr) {
        *intercept = false;
        // 未拦截的请求内核自行管理生命周期，不要 destroy
        return;
    }
    *intercept = true;

    char *method = nullptr;
    OH_ArkWebResourceRequest_GetMethod(resourceRequest, &method);
    OH_LOG_INFO(LOG_APP, "sw-handler intercept %{public}s %{public}s", method ? method : "?", u.c_str());
    if (method) {
        OH_ArkWeb_ReleaseString(method);
    }

    std::string path = u.substr(strlen(kOrigin));
    auto q = path.find('?');
    if (q != std::string::npos) {
        path = path.substr(0, q);
    }
    auto h = path.find('#');
    if (h != std::string::npos) {
        path = path.substr(0, h);
    }
    if (path.empty() || path == "/") {
        path = "/index.html";
    }
    std::string rawPath = "dist" + path;

    ArkWeb_Response *resp = nullptr;
    OH_ArkWeb_CreateResponse(&resp);

    RawFile *raw = OH_ResourceManager_OpenRawFile(g_resMgr, rawPath.c_str());
    PendingReq *pending = (PendingReq *)calloc(1, sizeof(PendingReq));
    pending->req = resourceRequest;
    pending->handler = resourceHandler;
    pending->resp = resp;
    if (raw == nullptr) {
        OH_LOG_WARN(LOG_APP, "sw-handler 404 %{public}s", rawPath.c_str());
        SetCommonHeaders(resp);
        OH_ArkWebResponse_SetStatus(resp, 404);
        OH_ArkWebResponse_SetStatusText(resp, "Not Found");
        OH_ArkWebResponse_SetMimeType(resp, "text/plain");
        OH_ArkWebResourceHandler_DidReceiveResponse(resourceHandler, resp);
        const char *msg = "not found";
        size_t msgLen = strlen(msg);
        pending->buf = (uint8_t *)malloc(msgLen);
        memcpy(pending->buf, msg, msgLen);
        OH_ArkWebResourceHandler_DidReceiveData(resourceHandler, pending->buf, (int64_t)msgLen);
        OH_ArkWebResourceHandler_DidFinish(resourceHandler);
    } else {
        long size = OH_ResourceManager_GetRawFileSize(raw);
        uint8_t *buf = (uint8_t *)malloc((size_t)size);
        long got = buf ? OH_ResourceManager_ReadRawFile(raw, buf, (size_t)size) : -1;
        OH_ResourceManager_CloseRawFile(raw);
        pending->buf = buf;
        const bool readOk = (got == size);
        if (readOk && path == "/src/main.js") {
            // 传输层补丁：前置 registerNativeHttpHandler 注册（不改 dist 文件，
            // 与 Shell.ets 页面侧 scheme handler 的补丁保持一致）
            const size_t patchLen = strlen(kMainJsPatch);
            uint8_t *patched = (uint8_t *)malloc((size_t)size + patchLen);
            memcpy(patched, kMainJsPatch, patchLen);
            memcpy(patched + patchLen, buf, (size_t)size);
            free(buf);
            buf = patched;
            size += (long)patchLen;
            pending->buf = buf;
            OH_LOG_INFO(LOG_APP, "sw-handler served main.js with native-http patch");
        }
        if (readOk && ApplyStartupPatches(path, buf, size)) {
            pending->buf = buf;
        }
        if (!readOk) {
            OH_LOG_ERROR(LOG_APP, "sw-handler read fail %{public}s size=%{public}ld got=%{public}ld",
                         rawPath.c_str(), size, got);
            SetCommonHeaders(resp);
            OH_ArkWebResponse_SetStatus(resp, 500);
            OH_ArkWebResponse_SetStatusText(resp, "Read Error");
            OH_ArkWebResponse_SetMimeType(resp, "text/plain");
            OH_ArkWebResourceHandler_DidReceiveResponse(resourceHandler, resp);
            OH_ArkWebResourceHandler_DidFinish(resourceHandler);
        } else {
            SetCommonHeaders(resp);
            OH_ArkWebResponse_SetStatus(resp, 200);
            OH_ArkWebResponse_SetStatusText(resp, "OK");
            OH_ArkWebResponse_SetMimeType(resp, MimeFor(path).c_str());
            OH_ArkWebResourceHandler_DidReceiveResponse(resourceHandler, resp);
            OH_ArkWebResourceHandler_DidReceiveData(resourceHandler, buf, (int64_t)size);
            OH_ArkWebResourceHandler_DidFinish(resourceHandler);
            OH_LOG_INFO(LOG_APP, "sw-handler served %{public}s %{public}ld bytes", rawPath.c_str(), size);
        }
    }
    TrackPending(pending);
}

static void OnSwRequestStop(const ArkWeb_SchemeHandler *schemeHandler,
                            const ArkWeb_ResourceRequest *resourceRequest) {
    pthread_mutex_lock(&g_pendingMutex);
    for (auto it = g_pending.begin(); it != g_pending.end(); ++it) {
        PendingReq *p = *it;
        if (p->req == resourceRequest) {
            g_pending.erase(it);
            pthread_mutex_unlock(&g_pendingMutex);
            if (p->resp) {
                OH_ArkWeb_DestroyResponse(p->resp);
            }
            if (p->buf) {
                free(p->buf);
            }
            OH_ArkWebResourceRequest_Destroy(p->req);
            OH_ArkWebResourceHandler_Destroy(p->handler);
            free(p);
            return;
        }
    }
    pthread_mutex_unlock(&g_pendingMutex);
}

static napi_value SetupSwSchemeHandler(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1] = {nullptr};
    napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);

    if (g_resMgr == nullptr && argc >= 1) {
        g_resMgr = OH_ResourceManager_InitNativeResourceManager(env, args[0]);
    }

    ArkWeb_SchemeHandler *handler = nullptr;
    OH_ArkWeb_CreateSchemeHandler(&handler);
    OH_ArkWebSchemeHandler_SetOnRequestStart(handler, OnSwRequestStart);
    OH_ArkWebSchemeHandler_SetOnRequestStop(handler, OnSwRequestStop);
    bool ok = OH_ArkWebServiceWorker_SetSchemeHandler("https", handler);
    OH_LOG_INFO(LOG_APP, "OH_ArkWebServiceWorker_SetSchemeHandler(https) -> %{public}d resMgr=%{public}d",
                (int)ok, g_resMgr != nullptr);

    napi_value ret = nullptr;
    napi_get_boolean(env, ok, &ret);
    return ret;
}

EXTERN_C_START
static napi_value Init(napi_env env, napi_value exports) {
    napi_property_descriptor desc[] = {
        {"setupSwSchemeHandler", nullptr, SetupSwSchemeHandler, nullptr, nullptr, nullptr, napi_default, nullptr},
    };
    napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);
    return exports;
}
EXTERN_C_END

static napi_module spikeModule = {
    .nm_version = 1,
    .nm_flags = 0,
    .nm_filename = nullptr,
    .nm_register_func = Init,
    .nm_modname = "entry",
    .nm_priv = nullptr,
    .reserved = {0},
};

extern "C" __attribute__((constructor)) void RegisterSpikeModule(void) {
    napi_module_register(&spikeModule);
}

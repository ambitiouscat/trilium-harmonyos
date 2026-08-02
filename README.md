# TriliumNotes for HarmonyOS

Trilium Notes（[TriliumNext](https://github.com/TriliumNext/Trilium) 分支）的 HarmonyOS 移植版，采用**ArkWeb 壳方案**——复用 Trilium 的 Web 构建产物，`apps/standalone/dist` 装入鸿蒙 ArkWeb（Chromium 内核 WebView），前端代码零重写。

## 架构

- `entry/src/main/ets/pages/Shell.ets` — 正式壳页面（SchemeHandler + WebCookieManager + 返回键/键盘适配）
- `entry/src/main/ets/shell/NativeHttpBridge.ets` — 原生 HTTP 桥（registerNativeHttpHandler 对接 @ohos.net.http，含分段传输防 OOM）
- `entry/src/main/cpp/` — NDK ServiceWorker SchemeHandler（SW 请求必须走 NDK 接口）
- `entry/src/main/resources/rawfile/dist/` — Trilium standalone 构建产物

## 构建部署

```bash
# 先构建 Trilium standalone dist
cd ../Trilium
corepack enable && pnpm install
pnpm --filter @triliumnext/mobile build
# 产物在 apps/standalone/dist/，复制到 rawfile 后构鸿蒙应用
cd ../harmonyos-app
devecocli.cmd run --device "HUAWEI MateBook Pro"
```

## 许可证

本项目基于 **GNU Affero General Public License v3.0** 发布，包含 [TriliumNext/Trilium](https://github.com/TriliumNext/Trilium)（AGPL-3.0）的衍生代码。详见 [LICENSE](./LICENSE)。
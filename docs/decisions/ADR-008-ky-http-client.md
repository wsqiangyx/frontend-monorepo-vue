# ADR-008 HTTP 客户端从 axios 迁移到 ky

- 状态：已采纳
- 日期：2026-06-26

## 背景

项目此前使用 axios 作为 HTTP 客户端。经过评估发现以下问题：

- axios 功能完整但体积较大（~14KB gzipped），且近年出现供应链安全事件（如 1.7.4 版本安全漏洞）
- ky 基于原生 Fetch API，零外部依赖，体积仅 ~3KB gzipped
- ky 的 API 设计更现代，基于 Promise 链，提供 `json()`、`text()`、`blob()` 等快捷方法
- 项目 AGENTS.md 已明确 `shared-utils` 暴露 `HttpClient` 接口抽象，`shared-service` 仅消费接口而非直接依赖具体 HTTP 库，切换到 ky 对此架构约束的实现更有利
- 文件上传场景：ky 不支持上传进度回调，需使用原生 XHR 封装的 `uploadWithProgress`

## 决策

移除 axios，改用 **ky** 作为 HTTP 客户端。

架构层面：

- `shared-utils` 定义 `HttpClient` 接口抽象
- `shared-utils` 提供 ky 适配器实现
- `shared-service` 通过注入的 `HttpClient` 实例发起请求，不直接依赖 ky 或 axios
- 文件上传使用原生 XHR 封装的 `uploadWithProgress`

## 替代方案

| 方案       | 评估                                                            |
| ---------- | --------------------------------------------------------------- |
| axios      | 体积大，供应链风险，API 风格较旧                                |
| ofetch     | API 类似但生态较小，社区不如 ky 成熟                            |
| 原生 fetch | 缺少超时、重试、请求/响应拦截等企业级特性，需要自行封装大量逻辑 |

## 后果

- `shared-utils` 新增 `src/http-client/` 目录：接口定义、ky 适配器、uploadWithProgress
- `shared-service` 移除对 axios 的直接依赖，改为依赖 `shared-utils` 暴露的 `HttpClient` 接口
- ky 的请求/响应拦截通过 `hooks` 机制实现，API 与 axios interceptors 不同
- 文件上传使用独立函数 `uploadWithProgress`，基于原生 XHR 封装
- 移除 `pnpm-workspace.yaml` catalog 中的 `axios` 条目，新增 `ky`

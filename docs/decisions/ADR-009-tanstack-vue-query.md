# ADR-009 引入 TanStack Vue Query 管理服务端状态

- 状态：已采纳
- 日期：2026-06-26

## 背景

项目中服务端数据（用户信息、菜单、权限列表、仪表盘数据等）当前通过 Pinia store 手动管理，存在以下问题：

- 大量重复的 loading/error/data 三元组样板代码
- 缓存策略需手动实现，缺乏自动去重、后台刷新、窗口聚焦重取等能力
- 多个组件请求同一接口时无法自动去重，造成冗余网络请求
- 乐观更新、分页、无限滚动等常见模式需从零实现

TanStack Vue Query 提供声明式的服务端状态管理，可自动处理上述场景，显著减少样板代码并提升用户体验。

## 决策

引入 **@tanstack/vue-query**（v5），将服务端数据的获取、缓存、同步委托给 Vue Query。

职责划分：

- **Vue Query**：服务端状态（API 数据获取、缓存、同步、乐观更新）
- **Pinia**：客户端 UI 状态（侧边栏折叠、主题偏好、表单草稿等）

协同方式：Vue Query 的 `queryFn` 内调用 `shared-service` 的 API 函数，API 函数通过注入的 `HttpClient`（ky 适配器）发起请求。

## 替代方案

| 方案                 | 评估                                                   |
| -------------------- | ------------------------------------------------------ |
| SWRV                 | Vue 生态的 SWR 实现，功能较少，社区不活跃              |
| Pinia Colada         | 实验阶段，API 不稳定，社区未成熟                       |
| 手动管理（当前方案） | 样板代码多，缓存、去重、后台刷新需手动实现，维护成本高 |

## 后果

- `apps/vue3-app` 启动链新增 `VueQueryPlugin` 注册
- 视图层数据获取模式从手动 `fetch` + Pinia 改为 `useQuery` / `useMutation`
- `shared-service` 提供纯 API 函数，供 Vue Query 的 `queryFn` 消费
- Mock 服务（MSW）无需修改，Vue Query 在网络层透明消费
- 与 ky 适配器协同：Vue Query → `shared-service` API 函数 → `HttpClient` 接口 → ky 适配器 → 网络层
- Pinia store 从服务端数据管理中解放，聚焦客户端 UI 状态

# Vue3 中后台前端平台 Monorepo 架构设计方案

**文档版本**：v2.0  
**修订日期**：2026-06-26  
**适用仓库**：`vue-admin-monorepo`  
**文档性质**：唯一上游概要设计

---

## 1. 引言

### 1.1 定位与目标

本文档是仓库的**正式架构契约**，定义基于 Vue3 的中后台前端平台脚手架的顶层设计、模块边界、依赖规则、运行时链路、质量门禁与治理机制。所有下游文档（`README`、`AGENTS`、`TEMPLATE`、测试规范等）均须从本文档派生，不得反向定义。

### 1.2 适用范围

- 当前仓库所有正式基线包与 `vue3-app` 应用壳
- 模板消费者接手后的默认职责边界
- 新功能接入时的架构审查依据

### 1.3 术语表

| 术语                    | 说明                                                  |
| ----------------------- | ----------------------------------------------------- |
| 应用壳 (App Shell)      | 可独立部署的 SPA 宿主，负责路由、状态接线与页面编排   |
| 共享包 (Shared Package) | Monorepo 内可被应用壳引用的基础库                     |
| Design Token            | 平台无关的设计变量，输出为 CSS 变量、组件库主题配置等 |
| Composition Root        | 应用的装配入口，负责依赖注入与全局初始化              |
| MSW                     | Mock Service Worker，用于浏览器和测试环境的 API 模拟  |

---

## 2. 产品定义

本仓库是一个**面向团队复用的 Vue3 中后台前端平台脚手架 Monorepo**，以 Git 模板仓库形式交付。

**它不是**：

- 通用空白模板
- 与固定后端强耦合的演示项目

**它提供**：

- 完整的 Vue3 应用壳基线
- 共享的设计令牌、国际化、通用工具、服务层、UI 组件、图表及工作流引擎
- 通过 MSW 驱动的完整平台主链路，保持后端无关（默认适配芋道后端）
- 让模板消费者能在此基础上快速收敛业务样例和专题子应用

---

## 3. 架构风格与关键决策

### 3.1 组合架构

仓库采用以下架构风格复合而成：

- **Workspace Monorepo**：通过 pnpm workspace 划分包边界，使用 catalog + overrides 统一版本
- **Clean Architecture**：分离平台规则、宿主装配、UI 呈现与外部适配
- **Ports / Adapters**：共享契约定义核心端口，Mock、Element Plus、ky 等作为适配器
- **Composition Root**：宿主应用 (`vue3-app`) 负责最终装配，不反向定义共享规则

### 3.2 关键架构决策 (ADR)

重大架构决策记录于 `docs/decisions/`，当前包含以下已采纳决策。

| 决策编号 | 标题                                               | 决策日期   | 状态      | 正式文档 |
| -------- | -------------------------------------------------- | ---------- | --------- | -------- |
| ADR-001  | `shared-service` 中的纯函数禁止依赖 UI 框架        | 2026-05-10 | ✅ 已采纳 | 已完成   |
| ADR-002  | 正式宿主为 Vue3 单应用壳                           | 2026-05-19 | ✅ 已采纳 | 已完成   |
| ADR-003  | 选用 Element Plus 作为 Vue3 宿主组件库             | 2026-05-19 | ✅ 已采纳 | 已完成   |
| ADR-004  | 采用 pnpm catalog + overrides 统一管理核心依赖版本 | 2026-05-18 | ✅ 已采纳 | 已完成   |
| ADR-005  | 工作流引擎以 `shared-workflow` 独立包交付          | 2026-05-18 | ✅ 已采纳 | 已完成   |
| ADR-006  | 文档修订与审核机制                                 | 2026-05-19 | ✅ 已采纳 | 已完成   |
| ADR-007  | 采用 Tailwind CSS 替代 UnoCSS 作为原子化 CSS 方案  | 2026-06-26 | ✅ 已采纳 | 已完成   |
| ADR-008  | HTTP 客户端从 axios 迁移到 ky                      | 2026-06-26 | ✅ 已采纳 | 已完成   |
| ADR-009  | 引入 TanStack Vue Query 作为服务端状态管理层       | 2026-06-26 | ✅ 已采纳 | 已完成   |

> **补充说明**：ADR-002 和 ADR-003 为技术栈选择的根基性决策，建议在仓库初始化后一个月内完成正式决策文档的编写，记录完整的背景、替代方案评估及决策后果。

#### ADR-001：`shared-service` 纯函数禁止依赖 UI 框架

**背景**：`shared-service` 承载权限判断、Token 管理等核心逻辑，需在 Vue 组件和测试中复用且保持行为一致。  
**决策**：所有对外可复用函数（如 `checkPermission`）必须是纯函数，不依赖 Vue、DOM 或浏览器 API。存储通过依赖注入传入。  
**后果**：共享规则可测试性强，平台规则与 UI 解耦。

#### ADR-002：正式宿主为 Vue3 单应用壳

**背景**：团队技术栈集中于 Vue3，单一宿主可降低架构复杂度，同时保留共享包的复用能力。  
**决策**：正式宿主仅保留 `apps/vue3-app`，使用 Vue3 + Element Plus。不包含 React 宿主。  
**后果**：共享包无需跨框架适配，`shared-ui` 仅实现 Vue 组件，`shared-i18n` 仅提供 Vue 初始化，工程维护成本显著降低。

#### ADR-003：选用 Element Plus 作为组件库

**背景**：需要一套企业级 Vue3 组件库，要求类型安全、主题可定制、社区活跃。此前选用 TDesign Vue Next，但因其社区规模较小（GitHub 4.2k stars vs Element Plus 25.4k stars）、第三方资源稀缺，且 TDesign 的 CSS 变量定制方案与后续引入的 Tailwind CSS 存在部分重叠。  
**决策**：舍 TDesign Vue Next，选用 **Element Plus** (`element-plus`)，理由包括社区最大、组件最全、生态最成熟、文档与问题解决方案丰富。  
**替代方案**：Naive UI（TypeScript 支持更优但社区中等）、TDesign Vue Next（社区规模小，第三方资源稀缺）。  
**后果**：`design-tokens` 输出 Element Plus CSS 变量契约（`--el-*`），`shared-ui` 组件基于 Element Plus 封装，国际化使用 `el-config-provider` + Element Plus locale。

#### ADR-004：pnpm catalog + overrides 统一版本管理

**背景**：多包 Monorepo 需避免依赖版本碎片化。  
**决策**：在 `pnpm-workspace.yaml` 定义 `catalog`（版本范围）和 `overrides`（精确固定）两套机制。核心运行时与构建依赖声明在 `catalog` 中，子包使用 `"element-plus": "catalog:"` 引用；关键工具链通过 `overrides` 全局固定版本。  
**后果**：单点升级，版本冲突显性化，构建工具版本全局一致。

#### ADR-005：工作流独立包交付

**背景**：工作流引擎依赖重型库 `bpmn-js`，非所有场景必需。  
**决策**：`shared-workflow` 独立于 `shared-ui`，内部含 Vue 组件封装。  
**后果**：按需引入，避免强制依赖。

#### ADR-006：文档修订与审核机制

**背景**：架构文档作为唯一上游契约，需保证修订可控。  
**决策**：修改须通过 PR，经架构负责人审核，更新版本号并同步下游文档。  
**后果**：文档权威性有保障，变更可追溯。

#### ADR-007：采用 Tailwind CSS 替代 UnoCSS

**背景**：项目此前使用 UnoCSS 作为原子化 CSS 方案。UnoCSS 性能优秀且灵活，但其生态规模、社区资源、IDE 集成成熟度均弱于 Tailwind CSS。Tailwind CSS v4 引入 `@tailwindcss/vite` 原生 Vite 插件，构建性能已大幅提升，且其 CSS-first 配置方式与项目 design-tokens 体系更契合。
**决策**：移除 UnoCSS，采用 **Tailwind CSS v4** 作为原子化 CSS 方案，通过 `@tailwindcss/vite` 插件集成。
**替代方案**：UnoCSS（继续使用，但社区资源有限，IDE 支持不如 Tailwind CSS）、Windi CSS（已停止维护）。
**后果**：

- 移除 `uno.config.ts`，新增 Tailwind CSS 配置（通过 CSS `@theme` 指令或 `tailwind.config.ts`）
- Vite 插件从 `unocss/vite` 切换为 `@tailwindcss/vite`
- `design-tokens` 不再输出 UnoCSS 预设，改为通过 `@theme` 指令注入设计令牌到 Tailwind 主题
- 属性化语法（`presetAttributify`）不再可用，需全局迁移为 class 写法

#### ADR-008：HTTP 客户端从 axios 迁移到 ky

**背景**：项目此前使用 axios 作为 HTTP 客户端。axios 功能完整但体积较大，且近年出现供应链安全事件。ky 基于 Fetch API，零依赖、体积小（~3KB gzipped vs axios ~14KB），API 设计更现代（基于 Promise 链 + `json()` 快捷方法）。同时，AGENTS.md 已明确 `shared-utils` 暴露 `HttpClient` 接口抽象，`shared-service` 仅消费接口而非直接依赖具体 HTTP 库。
**决策**：移除 axios，改用 **ky** 作为 HTTP 客户端，并在 `shared-utils` 中定义 `HttpClient` 接口抽象层，`shared-service` 通过接口消费。
**替代方案**：axios（体积大，供应链风险）、ofetch（API 类似但生态较小）、原生 fetch（缺少超时、重试、拦截器等企业级特性）。
**后果**：

- `shared-utils` 新增 `HttpClient` 接口与 ky 适配器实现
- `shared-service` 不再直接依赖 axios，改为注入 `HttpClient` 实例
- 文件上传场景使用原生 XHR 封装的 `uploadWithProgress`（ky 不支持上传进度回调）
- ky 的请求/响应拦截通过 `hooks` 机制实现，API 与 axios interceptors 不同

#### ADR-009：引入 TanStack Vue Query 管理服务端状态

**背景**：项目中服务端数据（用户信息、菜单、权限列表等）当前通过 Pinia store 手动管理加载态、错误态和缓存，存在大量重复的 loading/error/data 三元组样板代码。TanStack Vue Query 提供声明式的服务端状态管理，自动处理缓存、去重、后台刷新、乐观更新等能力，显著减少样板代码。
**决策**：引入 **@tanstack/vue-query**，将服务端数据的获取、缓存、同步逻辑委托给 Vue Query，Pinia 仅保留客户端 UI 状态（如侧边栏折叠、主题偏好）。
**替代方案**：SWRV（Vue 生态的 SWR 实现，功能较少）、Pinia Colada（实验性，社区未成熟）、手动管理（当前方案，样板代码多）。
**后果**：

- `apps/vue3-app` 启动链新增 `VueQueryPlugin` 注册
- 视图层数据获取从手动 `fetch` + Pinia 改为 `useQuery` / `useMutation`
- Mock 服务（MSW）无需修改，Vue Query 在网络层透明消费
- 与 ky 适配器协同：Vue Query 的 `queryFn` 内调用 `HttpClient` 接口

#### 架构重议触发条件

以下条件出现时，需重新评估对应架构决策：

| 触发条件                                         | 需重议的决策                             |
| ------------------------------------------------ | ---------------------------------------- |
| 引入第二个 UI 框架或技术栈                       | ADR-002（单宿主）                        |
| Element Plus 停止维护或出现重大不兼容升级        | ADR-003（组件库选型）                    |
| 需支持 IE11 或特殊老旧浏览器                     | 构建工具链、Polyfill 策略                |
| 团队规模超过 10 人且多团队并行开发               | Monorepo 工具链（是否引入 Nx/Turborepo） |
| 需将共享包发布到外部团队或公有 npm               | ADR-004（版本管理策略）                  |
| 后端接口规范发生重大变化（如 GraphQL 替代 REST） | 整体服务层架构                           |

---

## 4. 仓库顶层结构

```
vue-admin-monorepo/
├─ apps/
│  └─ vue3-app/                # Vue3 正式宿主应用
├─ packages/
│  ├─ design-tokens/           # 设计令牌（CSS 变量、Element Plus 主题适配、Tailwind CSS 主题扩展）
│  ├─ shared-utils/            # 通用工具（格式化、校验、存储、请求、日志）
│  ├─ shared-i18n/             # 国际化运行时与语言包
│  ├─ shared-service/          # 服务层（API 封装、Token 管理、权限判断、Mock）
│  ├─ shared-ui/               # Vue3 UI 组件封装
│  └─ shared-workflow/         # 工作流引擎基础契约
├─ docs/
│  └─ decisions/               # ADR 正式文档
├─ docker/                     # 容器部署配置
├─ scripts/                    # 构建与工具脚本
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ eslint.config.mjs
├─ vitest.config.ts
├─ STATUS.yaml                 # 包治理状态清单
└─ .env.example
```

---

## 5. 分层架构与依赖规则

### 5.1 层次划分

| 层级           | 包含包/目录                                     | 角色                                   |
| -------------- | ----------------------------------------------- | -------------------------------------- |
| **宿主层**     | `apps/vue3-app`                                 | 组合根，路由装配、store 接线、页面编排 |
| **交付适配层** | `shared-ui`, `shared-service` (API/Token)       | Vue UI 适配，API 边界与 Mock           |
| **平台内核层** | `shared-service` (权限/类型), `shared-workflow` | 平台领域模型、应用规则、工作流引擎     |
| **基础共享层** | `design-tokens`, `shared-utils`, `shared-i18n`  | 通用运行时、主题系统、国际化           |

### 5.2 正式依赖方向

```
运行时依赖方向（不可逆）：
vue3-app → shared-ui → shared-service → shared-utils
             ↓            ↓
         design-tokens  shared-i18n
```

**强制约束**：

- 基础共享层不依赖任何上层包
- `shared-service` 权限判断等纯函数不依赖 Vue/DOM
- `shared-ui` 不反向定义平台规则
- 宿主应用不能复制共享层的主题或 i18n 运行时
- `@repo/shared-service/mock/browser` 仅限开发/测试环境引入，生产构建时 Tree Shaking 剔除

### 5.3 依赖检查规则

以下规则用于后续 `check:arch` 治理脚本，目前仍属于治理缺口而非已落地门禁：

- 基础共享层 (`design-tokens`, `shared-utils`, `shared-i18n`) 的 `dependencies` 不得包含其他 workspace 包
- `shared-service` 不得依赖 `vue`, `vue-router`, `pinia`, `element-plus`, `@antv/g2`, `bpmn-js`
- `shared-ui` 不得依赖 `apps/*`
- `apps/vue3-app` 不得依赖其他 `apps/*`
- 生产依赖不得直接引用 `msw`

### 5.4 包间依赖矩阵

| 包名              | 可依赖项                                                                         | 禁止依赖项       |
| ----------------- | -------------------------------------------------------------------------------- | ---------------- |
| `design-tokens`   | 无                                                                               | 所有             |
| `shared-utils`    | 无                                                                               | Vue, 平台语义    |
| `shared-i18n`     | vue-i18n (peer), element-plus                                                    | 宿主应用         |
| `shared-service`  | shared-utils, msw                                                                | UI 框架, DOM     |
| `shared-ui`       | design-tokens, shared-utils, shared-i18n, shared-service, element-plus, @antv/g2 | 宿主应用         |
| `shared-workflow` | design-tokens, shared-utils, bpmn-js, element-plus                               | 宿主应用业务规则 |
| `apps/vue3-app`   | 所有共享包                                                                       | 无               |

---

## 6. 各层职责详细说明

### 6.1 基础共享层

#### `design-tokens` – 设计令牌

- **提供**：CSS 自定义属性、Element Plus CSS 变量契约、Tailwind CSS 主题扩展（颜色、字号、间距、圆角等）、图表配色常量
- **子路径**：`./tokens.css`, `./tdesign-theme`, `./uno-preset`
- **不负责**：业务状态、私有主题逻辑

#### `shared-utils` – 通用工具

- **提供**：日期格式化、数据校验、存储抽象 (`createStorage`)、HttpClient 接口抽象、ky 适配器、uploadWithProgress（XHR 封装）、分级日志
- **约束**：浏览器 API 通过工厂函数注入，禁止直接使用

#### `shared-i18n` – 国际化

- **提供**：中英文语言包、`createVueI18n` 初始化函数、Element Plus locale 映射 (`zhCN`, `enUS`)
- **契约**：持久化 key `locale`，运行时切换，通过 `el-config-provider` 联动组件内部文案

### 6.2 平台内核层 / 服务层

#### `shared-service` – 服务与契约

- **API 模块**：按业务域拆分，响应格式 `{ code, msg, data }`
- **TokenManager**：双 Token 刷新队列，并发请求排队
- **权限判断**：纯函数 `checkPermission(permissions, required)`
- **Mock 服务**：MSW handlers，与 API 类型同构

**扩展预留**：当前权限模型为 RBAC（基于角色）。若未来需要支持多租户或数据权限（如“只能查看本部门数据”），扩展路径如下：

- 在 `shared-service/types.ts` 中扩展 `ApiResponse` 或请求参数，增加 `tenantId` 字段
- 在 `shared-service/` 的 API 封装中透传租户上下文
- 权限判断函数 `checkPermission` 保持不变（数据权限属于接口过滤层，不在前端权限判断范围）
- 宿主 store 中增加 `tenantId` 状态，登录后从后端获取

### 6.3 交付适配层

#### `shared-ui` – Vue3 UI

`shared-ui` 负责提供基于 Element Plus 二次封装的 Vue3 组件。封装遵循以下分层原则：

| 封装模式         | 适用场景                                          | 示例                                                            |
| ---------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| **直接透传**     | 组件 Props 与 Element Plus 完全一致，无需额外逻辑 | `el-button` → 直接 re-export                                    |
| **Props 重组织** | 需要统一 API 风格或注入平台语义                   | `el-menu` → `SidebarMenu`，接收 `MenuItem[]` 并自动处理权限过滤 |
| **组合封装**     | 由多个 Element Plus 组件组装而成                  | `PageContainer` = `el-container` + `` + 共享样式                |

**约束**：

- 所有组件样式通过 `design-tokens` 的 CSS 变量和 Element Plus CSS 变量契约控制，禁止在组件内硬编码颜色、字号等视觉属性
- 组件命名遵循 PascalCase，Props 命名使用 camelCase
- 每个组件文件必须包含 `defineProps` 的类型声明

**已实现组件**：`PageContainer`, `SidebarMenu`, `AuthButton`

**规划中能力**：图表组件、布局 Hooks

#### `shared-workflow` – 工作流引擎

- **当前已实现**：`core/` 下的框架无关类型与常量导出
- **规划中能力**：`BpmnDesigner`、`BpmnViewer`、`FormDesigner` 等 Vue 封装

### 6.4 宿主层

#### `apps/vue3-app` – 组合根

- **技术栈**：Vue3 + Pinia + vue-router + Element Plus + vue-i18n + @tanstack/vue-query
- **启动链**：环境校验 → 开发态 Mock 启动 → design tokens 注入 / `Tailwind CSS` → i18n → Router/Pinia → 挂载
- **内部结构**：

| 目录/文件    | 职责                                        |
| ------------ | ------------------------------------------- |
| `bootstrap/` | 环境校验、Mock、design tokens、runtime 装配 |
| `main.ts`    | 启动入口                                    |
| `views/`     | 页面组件                                    |

---

## 7. 运行时架构

### 7.1 启动链

1. 环境变量校验
2. 开发环境动态启动 MSW (`@repo/shared-service/mock/browser`)
3. 注入 design tokens，并引入 `Tailwind CSS`
4. 创建 i18n 实例 (`createVueI18n()`)
5. 注册 Element Plus (`el-config-provider` 传入全局配置和语言)
6. 注册 Pinia、Router
7. 挂载 Vue 应用

### 7.2 认证与权限链

1. `shared-service/auth.ts` 定义登录/登出 API
2. `TokenManager` 管理双 Token
3. Pinia userStore 调用 API，存储用户信息和权限
4. 路由守卫调用 `checkPermission` 拦截
5. `AuthButton` 组件消费 `checkPermission` 控制显隐

### 7.3 数据访问链

`shared-service/` 封装 API → 页面或 store 调用 → 返回 `ApiResponse<T>` → 开发环境 MSW 拦截

---

## 8. 国际化方案

- 运行时切换，`el-config-provider :global-config` 联动 Element Plus 组件文案
- 语言包命名空间：`common`, `menu`, `app`
- 持久化 key `locale`，默认 `zh-CN`

---

## 9. Mock 策略

- 使用 MSW，handlers 按业务模块划分
- 启动入口 `@repo/shared-service/mock/browser`，仅开发环境动态加载
- 数据格式与真实 API 同构

---

## 10. 测试策略（渐进式）

| 层级     | 范围                                | 工具                     | 状态       | 目标            |
| -------- | ----------------------------------- | ------------------------ | ---------- | --------------- |
| 单元测试 | shared-utils、shared-service 纯函数 | Vitest                   | 根配置就绪 | 核心路径 ≥80%   |
| 组件测试 | shared-ui 关键交互                  | Vitest + @vue/test-utils | 已落地     | 关键路径覆盖    |
| 集成测试 | vue3-app + Mock 交互链              | Vitest                   | 已落地     | 登录/权限主链路 |
| E2E 测试 | 关键业务流程                        | Playwright (候选)        | 未纳入基线 | Q3 评估         |

**覆盖率目标说明**：

- "核心路径"指**被两个及以上模块引用的导出函数**，以及**包含条件分支的关键业务判断函数**（如 `checkPermission`、`TokenManager.refreshToken`）
- 覆盖率统计以 `vitest --coverage` 输出的 `lines` 指标为准
- 初期不设为硬性门禁，作为团队自查指标；CI 稳定后再接入自动化阈值检查

**要求**：

- 宿主集成测试必须使用 `shared-service/mock` 替身，不得自建假数据
- 组件测试优先断言用户可见行为和可访问性

---

## 11. 质量门禁与治理

### 11.1 已落地门禁

- `pnpm lint`：ESLint + Prettier，提交前自动修复
- `pnpm build`：全量构建验证
- TypeScript 严格模式全仓

### 11.2 治理缺口跟踪

| 缺口                 | 优先级 | 时间     | 负责人 |
| -------------------- | ------ | -------- | ------ |
| `check:arch`         | P1     | Q2       | 待定   |
| `ErrorBoundary` 组件 | P1     | Q2       | 待定   |
| E2E 基线             | P2     | Q3       | 待定   |
| `docs:check`         | P2     | Q3       | 待定   |
| 首屏体积门禁         | P2     | Q3       | 待定   |
| 主题色对比度校验     | P3     | 持续观察 | 待定   |
| 请求耗时采集         | P3     | 持续观察 | 待定   |

### 11.3 推荐预算基线

- 首屏增量 ≤50KB gzip
- 单入口初始 JS ≤200KB gzip
- 引入重型组件须附带体积报告

---

## 12. 技术栈与版本管理

通过 `pnpm-workspace.yaml` 的 `catalog` 统一版本，子包使用 `"vue": "catalog:"` 引用（当前全仓已统一采用 catalog 协议，根配置与 manifest 保持一致）。

| 类别     | 技术栈                            | 版本（catalog 声明） |
| -------- | --------------------------------- | -------------------- |
| 框架     | Vue3                              | ^3.5                 |
| 状态管理 | Pinia                             | ^2.2                 |
| 路由     | vue-router                        | ^4.4                 |
| 国际化   | vue-i18n                          | ^10                  |
| 组件库   | Element Plus                      | ^1.12.0              |
| 构建     | Vite, @vitejs/plugin-vue, vue-tsc | ^8.0, ^5.2, ^2.2     |
| 样式     | Tailwind CSS                      | ^4                   |
| 图表     | AntV G2                           | ^5.2                 |
| 网络     | ky                                | ^1                   |
| Mock     | MSW                               | ^2.5                 |
| 测试     | Vitest, @vue/test-utils           | ^2.4                 |
| 工作流   | bpmn-js                           | ^17.0                |

> **说明**：表中版本为 `pnpm-workspace.yaml` 中 `catalog` 的声明值，实际安装版本以 `pnpm-lock.yaml` 锁定为准。TypeScript (6.0.3)、ESLint (9.39.4)、Vitest (4.1.5)、Sass (1.99.0)、jsdom (29.1.0) 通过 `overrides` 全局锁定。

所有包当前 `private: true`，不发布 npm，Changesets 仅生成 CHANGELOG。

---

## 13. 环境变量管理

- 统一 `VITE_` 前缀
- 必需变量：`VITE_API_BASE_URL`
- 可选变量：`VITE_PROXY_TARGET`（仅在需要对接真实后端时配置）
- 宿主拥有独立的 `.env.development` / `.env.production`
- 共享包不得直接读取宿主私有环境变量；当前 `shared-utils` 中使用的 `VITE_` 变量视为临时实现，长期应通过初始化函数注入

---

## 14. 后端对接策略（芋道）

- API 封装于 `shared-service/`
- 响应格式 `{ code, msg, data }`
- 开发环境默认启用 MSW Mock（`VITE_ENABLE_MSW` 默认 `true`），关闭后通过 Vite proxy 转发 `/api` 到 `VITE_PROXY_TARGET`
- 支持混合模式：MSW 开启 + 配置代理，有 mock handler 的接口走 mock，其余透传到后端
- 功能对齐分阶段：系统管理 → 监控工具 → 工作流

---

## 15. 部署与 Docker 策略

- 独立构建，Nginx 作为基础镜像
- Dockerfile 多阶段构建
- Nginx 配置示例（SPA history 模式，`/api` 为后端接口前缀，按实际情况调整）：

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:48080;
        proxy_set_header Host $host;
    }
}
```

- `docker/` 目录提供 Dockerfile 与 Docker Compose 模板

---

## 16. 模板裁剪与扩展指南

模板消费者可根据自身需求对仓库进行裁剪，以下是常见场景的操作指引。

### 16.1 最小化脚手架

如果只需要最精简的启动模板，可删除以下包：

- `shared-workflow`：移除工作流引擎，删除目录后在根 `pnpm-workspace.yaml` 中去掉引用
- `shared-ui` 中的图表组件：若后续引入 `src/charts/`，可删除该目录并移除 `@antv/g2` 依赖
- 可选：删除 `shared-ui` 中未使用的业务组件，仅保留 `PageContainer`、`SidebarMenu` 等基础组件

### 16.2 更换组件库

如果要替换 Element Plus：

1. 在 `shared-ui` 中重写所有组件适配代码
2. 更新 `design-tokens` 中的主题导出（如从 Element Plus CSS 变量契约切换为其他组件库主题配置）
3. 更新 `shared-i18n` 中的 locale 映射（如从 Element Plus locale 切换为其他库的语言包）
4. 更新 `apps/vue3-app` 中的全局配置和启动链

### 16.3 切换后端

默认后端适配芋道，若对接其他后端：

1. 保持 `shared-service/types.ts` 中的通用响应格式，或替换为你自己的类型定义
2. 替换 `shared-service/` 下的 API 实现，保持函数签名不变或按需调整
3. 同步更新 `shared-service/mock/handlers/` 中的 Mock 处理器以匹配新接口
4. 设置 `VITE_PROXY_TARGET` 环境变量指向新后端地址，并在 `.env` 中设置 `VITE_ENABLE_MSW=false`

### 16.4 多租户或数据权限扩展

见 §6.2 扩展预留说明。

---

## 17. 包治理状态

仓库根目录 `STATUS.yaml` 记录各包的治理状态，状态分为三类：

- `stable`：正式基线成员，进入根脚本、测试矩阵、默认文档
- `candidate`：准备纳入正式基线，正在补充测试与文档
- `experimental`：实验性目录，不进入默认正式基线

当前初始状态：

```yaml
packages:
  design-tokens: stable
  shared-utils: stable
  shared-i18n: stable
  shared-service: stable
  shared-ui: stable
  shared-workflow: stable

apps:
  vue3-app: stable
```

包状态变更规则见 §3.2 ADR-006 中的文档修订流程，任何状态变更需通过 PR 审核并更新本表。

---

## 18. 文档修订与同步

### 18.1 修订流程

1. PR 提出修改，说明变更原因与影响范围
2. 至少一位架构负责人审核
3. 更新版本号与修订日期
4. 同步受影响的配套文件（`README.md`, `AGENTS.md`, `TEMPLATE.md`, `STATUS.yaml`, 测试规范等）

### 18.2 必须同步的下游文档

- 根 `README.md`
- 根 `AGENTS.md`
- 根 `TEMPLATE.md`
- `docs/规范/测试规范.md`
- `docs/decisions/` 中相关 ADR
- 根 `STATUS.yaml`

### 18.3 本版主要变更

**v1.4** (2026-05-20)：

- §3.1、§3.2、§12 更新：版本管理机制从仅 `catalog` 扩展为 `catalog + overrides` 双机制说明
- §12 技术栈表重构：对齐 React 版本文档格式，精简为单版本列 + `overrides` 脚注；补齐 Vue3 技术栈全貌
- `pnpm-workspace.yaml` 同步 React 版本组织风格，增加分类注释分组
- ADR-004 同步补充 `overrides` 机制说明与变更流程

**v1.3** (2026-05-19)：

- 新增 `docs/decisions/` 与 `docker/` 最小正式骨架
- `check:alias` 改为基于 `paths.config.ts` 的真实门禁
- 启动链、Mock 入口、`design-tokens` 导出路径与当前实现对齐
- 将图表组件、布局 hooks、工作流 Vue 封装等未落地能力改标为规划中

**v1.2** (2026-05-19)：

- §3.2 新增“架构重议触发条件”清单
- §6.2 新增“多租户与数据权限扩展预留”说明
- 新增 §16 模板裁剪与扩展指南

**v1.1** (2026-05-19)：

- ADR 索引表增加“正式文档”列，标注 ADR-002/003 待补全
- §5.3 依赖检查规则补充脚本路径引用
- §6.3 `shared-ui` 新增封装模式分层说明
- §10 测试覆盖率补充“核心路径”判定标准
- §12 TDesign 版本加注”以 catalog 实际锁定版本为准”
- 新增 §17 包治理状态章节及 `STATUS.yaml` 初始定义
- 原 §17 文档修订同步调整为 §18

**v1.0** (2026-05-19)：

- 初始版本，从跨框架设计中剥离出 Vue3 单框架设计方案
- 组件库选定 TDesign Vue Next（v1.0 初始选择，v2.0 已迁移至 Element Plus）
- 移除所有 React 相关内容
- ADR 体系重新建立
- 共享包简化，仅保留 Vue 实现

---

**本设计文档为仓库唯一架构真相源，任何技术实现、包边界调整、宿主扩展均需与此文档对齐。**
**决策**：正式宿主仅保留 `apps/vue3-app`，使用 Vue3 + Element Plus。不包含 React 宿主。
**决策**：在 `pnpm-workspace.yaml` 定义 `catalog`（版本范围）和 `overrides`（精确固定）两套机制。核心运行时与构建依赖声明在 `catalog` 中，子包使用 `"element-plus": "catalog:"` 引用；关键工具链通过 `overrides` 全局固定版本。
| Element Plus 停止维护或出现重大不兼容升级 | ADR-003（组件库选型） |
│ ├─ design-tokens/ # 设计令牌（CSS 变量、Element Plus 主题适配、Tailwind CSS 主题扩展）

- `shared-service` 不得依赖 `vue`, `vue-router`, `pinia`, `element-plus`, `@antv/g2`, `bpmn-js`
  | `shared-i18n` | vue-i18n (peer), element-plus | 宿主应用 |
  | `shared-service` | shared-utils, msw | UI 框架, DOM |
  | `shared-ui` | design-tokens, shared-utils, shared-i18n, shared-service, element-plus, @antv/g2 | 宿主应用 |
  | `shared-workflow` | design-tokens, shared-utils, bpmn-js, element-plus | 宿主应用业务规则 |
- **提供**：CSS 自定义属性、Element Plus CSS 变量契约、Tailwind CSS 主题扩展（颜色、字号、间距、圆角等）、图表配色常量
- **子路径**：`./tokens.css`, `./element-plus-theme`
- **提供**：日期格式化、数据校验、存储抽象 (`createStorage`)、`HttpClient` 接口抽象、ky 适配器、`uploadWithProgress`（XHR 封装）、分级日志
- **提供**：中英文语言包、`createVueI18n` 初始化函数、Element Plus locale 映射
- **契约**：持久化 key `locale`，运行时切换，通过 `el-config-provider` 联动 Element Plus 组件内部文案
- **API 模块**：按业务域拆分，响应格式 `{ code, msg, data }`；通过注入的 `HttpClient` 接口发起请求，不直接依赖具体 HTTP 库
- **Mock 服务**：MSW handlers，与 API 类型同构
- **服务端状态管理**：通过 `@tanstack/vue-query` 在宿主层集成，`shared-service` 提供 API 函数供 `useQuery` / `useMutation` 消费
  `shared-ui` 负责提供基于 Element Plus 二次封装的 Vue3 组件。封装遵循以下分层原则：
  | **直接透传** | 组件 Props 与 Element Plus 完全一致，无需额外逻辑 | `el-button` → 直接 re-export |
  | **Props 重组织** | 需要统一 API 风格或注入平台语义 | `el-menu` → `SidebarMenu`，接收 `MenuItem[]` 并自动处理权限过滤 |
  | **组合封装** | 由多个 Element Plus 组件组装而成 | `PageContainer` = `el-container` + 共享样式 |
- 所有组件样式通过 `design-tokens` 的 CSS 变量、Element Plus CSS 变量契约和 Tailwind CSS 原子类控制，禁止在组件内硬编码颜色、字号等视觉属性
- **技术栈**：Vue3 + Pinia + vue-router + Element Plus + vue-i18n + @tanstack/vue-query
- **启动链**：环境校验 → 开发态 Mock 启动 → design tokens 注入 / Tailwind CSS → i18n → Router/Pinia / VueQueryPlugin → 挂载

3.  注入 design tokens CSS 变量，引入 Tailwind CSS 入口样式
4.  注册 Element Plus (`el-config-provider` 传入主题和语言)
5.  注册 Pinia、Router、VueQueryPlugin
6.  `shared-service/auth` 定义登录/登出 API 类型与函数
    `shared-service` API 函数 → Vue Query `useQuery` / `useMutation` → `HttpClient` 适配器（ky）→ 返回 `ApiResponse<T>` → 开发环境 MSW 拦截

- 运行时切换，`el-config-provider :locale` 联动 Element Plus 组件文案
  | 组件库 | Element Plus | ^2.9 |
  | 样式 | Tailwind CSS | ^4 |
  | 服务端状态 | @tanstack/vue-query | ^5 |
  > **说明**：表中版本为 `pnpm-workspace.yaml` 中 `catalog` 的声明值，实际安装版本以 `pnpm-lock.yaml` 锁定为准。TypeScript (6.0.3)、ESLint (9.39.4)、Vitest (4.1.5)、Sass (1.99.0)、jsdom (29.1.0) 通过 `overrides` 全局锁定。
- API 封装于 `shared-service/`

### 16.2 更换组件库（当前基线为 Element Plus）

如果要替换 Element Plus：

1.  在 `shared-ui` 中重写所有组件适配代码，将 Element Plus 组件替换为目标库组件
2.  更新 `design-tokens` 中的主题导出（从 Element Plus CSS 变量契约切换为其他组件库主题配置）
3.  更新 `shared-i18n` 中的 locale 映射（从 Element Plus locale 切换为其他库的语言包）
4.  替换 `shared-service/` 下的 API 实现，保持函数签名不变或按需调整

**v2.0** (2026-06-26)：

- §3.2：新增 ADR-007（Tailwind CSS 替代 UnoCSS）、ADR-008（ky 替代 axios）、ADR-009（引入 TanStack Vue Query）
- §3.2 ADR-002：修正组件库引用为 Element Plus
- §3.2 架构重议触发条件：更新为 Element Plus
- §4：`design-tokens` 仓库结构描述更新（Element Plus 主题适配 + Tailwind CSS 主题扩展）
- §5.3-5.4：依赖检查规则与包间依赖矩阵更新（tdesign-vue-next → element-plus，axios 移除直接依赖）
- §6.1：`design-tokens` 职责描述更新（移除 UnoCSS 预设，新增 Tailwind CSS 主题扩展）；`shared-utils` 新增 HttpClient 接口抽象、ky 适配器、uploadWithProgress；`shared-i18n` 更新为 Element Plus locale 映射
- §6.2：`shared-service` 新增 TanStack Vue Query 集成说明，移除 `modules/` 目录引用
- §6.3：`shared-ui` 组件库从 TDesign 更新为 Element Plus，封装模式示例更新
- §6.4：宿主层技术栈更新（Element Plus + Tailwind CSS + @tanstack/vue-query）
- §7：运行时启动链、认证链、数据访问链更新（Tailwind CSS、el-config-provider、VueQueryPlugin、HttpClient 适配器）
- §8：国际化方案从 `t-config-provider` 更新为 `el-config-provider`
- §12：技术栈表全面更新（组件库、样式、网络、新增服务端状态管理行），overrides 脚注更新
- §14、§16：模板裁剪指南与后端对接章节更新（移除 `modules/` 引用，组件库替换指南更新）

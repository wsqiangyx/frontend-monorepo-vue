# vue-admin-monorepo

面向团队复用的 Vue3 中后台前端平台脚手架 Monorepo Git 模板仓库。以 Vue3 为正式宿主，提供 Vue3 应用壳、共享主题与 i18n 运行时、MSW/mock 基线，以及可复用的 Vite / Vitest / TypeScript 工程底座。

正式设计主入口：[`docs/总体设计/Vue3 中后台前端平台 Monorepo 架构设计方案.md`](./docs/总体设计/Vue3%20中后台前端平台%20Monorepo%20架构设计方案.md)。

## 先看这里

- Day 0 清单：[`TEMPLATE.md`](./TEMPLATE.md)
- 总体设计：[`docs/总体设计/Vue3 中后台前端平台 Monorepo 架构设计方案.md`](./docs/总体设计/Vue3%20中后台前端平台%20Monorepo%20架构设计方案.md)
- 初始化与裁剪手册：[`docs/教程/模板初始化与裁剪指南.md`](./docs/教程/模板初始化与裁剪指南.md)
- 维护约束：[`AGENTS.md`](./AGENTS.md)

## 当前定位

这是一个以 Vue3 为正式宿主应用的前端 monorepo 基线仓库，不是单应用仓库，也不是通用前端空白模板。

- `apps/vue3-app`：Vue3 + TDesign 应用壳
- `packages/shared-utils`：通用工具（格式化、校验、存储、请求、日志）
- `packages/shared-i18n`：国际化运行时与语言包（vue-i18n）
- `packages/shared-service`：服务层（API 封装、Token 管理、权限判断、Mock）
- `packages/design-tokens`：设计令牌（CSS 变量、TDesign 主题适配、UnoCSS 预设）
- `packages/shared-ui`：Vue3 UI 组件、图表组件、布局 Hooks
- `packages/shared-workflow`：工作流引擎（experimental）

## 当前架构

- `apps/vue3-app`：正式宿主应用，也是 composition root
- `packages/shared-service`：平台领域模型与应用规则
- `packages/shared-utils`、`packages/design-tokens`：基础共享运行时
- `packages/shared-ui`、`packages/shared-i18n`：交付适配层

## 快速开始

### 1. 安装环境

- Node.js `>=24.11.0 <25`
- 推荐本地版本：`.nvmrc` 中的 `24.15.0`
- `pnpm@10.33.1`

```bash
corepack enable
corepack prepare pnpm@10.33.1 --activate
```

### 2. 安装依赖并运行

```bash
pnpm install
pnpm dev:vue
```

### 3. 执行基线校验

```bash
pnpm verify
```

## 常用脚本

| 命令                | 说明                           |
| ------------------- | ------------------------------ |
| `pnpm dev:vue`      | 启动 Vue3 应用                 |
| `pnpm build:shared` | 构建共享包                     |
| `pnpm build:vue`    | 先构建共享包，再构建 Vue3 应用 |
| `pnpm build`        | 执行仓库完整构建链路           |
| `pnpm typecheck`    | 执行全仓类型检查               |
| `pnpm lint`         | 执行 ESLint                    |
| `pnpm test`         | 执行全仓测试                   |
| `pnpm verify`       | 聚合执行所有校验               |

## 目录结构

```text
vue-admin-monorepo/
├─ apps/
│  └─ vue3-app/                  # Vue3 正式宿主应用
├─ packages/
│  ├─ design-tokens/             # 设计令牌与 TDesign 主题
│  ├─ shared-utils/              # 通用工具
│  ├─ shared-i18n/               # 国际化运行时
│  ├─ shared-service/            # 服务层与 Mock
│  ├─ shared-ui/                 # Vue3 UI 组件
│  └─ shared-workflow/           # 工作流引擎（experimental）
├─ docs/
│  └─ 总体设计/                   # Vue3 架构设计方案
├─ scripts/
├─ pnpm-workspace.yaml
└─ package.json
```

## 关键运行时约束

- 启动链：环境校验 → Mock → tokens.css → i18n → Router/Store → 挂载
- `shared-service/mock-setup` 仅限开发/测试环境引入
- `design-tokens` 导出 TDesign CSS 变量契约
- `shared-i18n` 使用 vue-i18n，通过 `t-config-provider` 联动
- package `exports` 继续只指向 `dist/`

更完整的维护约束见 [`AGENTS.md`](./AGENTS.md)。

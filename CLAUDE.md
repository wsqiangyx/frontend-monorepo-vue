# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Vue3 中后台前端平台脚手架 Monorepo。以 Vue3 + Element Plus 为正式宿主，pnpm workspace 管理 1 个应用 + 6 个共享包。

## 常用命令

```bash
# 开发
pnpm dev:vue              # 启动 Vue3 应用开发服务器

# 构建
pnpm build:shared         # 仅构建 6 个共享包
pnpm build:vue            # 共享包 + Vue3 应用
pnpm build                # 等同于 build:vue

# 校验
pnpm typecheck            # 全仓 TypeScript 类型检查
pnpm lint                 # ESLint
pnpm lint:fix             # ESLint 自动修复
pnpm stylelint            # Stylelint（SCSS/CSS）
pnpm format               # Prettier 格式化
pnpm format:check         # Prettier 仅检查
pnpm test                 # 全仓测试
pnpm test:coverage        # 测试覆盖率
pnpm test:watch           # 测试 watch 模式
pnpm verify               # 完整校验流水线：format:check → lint → stylelint → typecheck → check:alias → check:status → test → build → template:check

# 契约检查
pnpm check:alias          # 验证 Vite alias 与 tsconfig paths 一致
pnpm check:status         # 验证 STATUS.yaml 一致性
```

单个包内也可直接运行 `pnpm test`、`pnpm typecheck` 等，脚本通过 `scripts/vite.cjs` / `scripts/vitest.cjs` 封装以兼容 Windows。

## 环境要求

- Node.js `>=24.11.0 <25`（推荐 `.nvmrc` 中的 `24.15.0`）
- pnpm `10.33.1`（通过 corepack 启用）
- 依赖版本统一由 `pnpm-workspace.yaml` 的 `catalog:` 管理，overrides 中锁定 TypeScript `6.0.3`、Vitest `4.1.5` 等

## 架构

### 包依赖方向（不可逆）

```
vue3-app → shared-ui → shared-service → shared-utils
              ↓            ↓
          design-tokens  shared-i18n
```

- `shared-utils`：零框架依赖的纯工具（格式化、校验、存储、HttpClient 接口 + ky 适配器、XHR 上传、日志）
- `shared-service`：纯函数服务层（API 模块、TokenManager、权限、Mock handlers），不依赖 Vue/DOM
- `shared-i18n`：vue-i18n 运行时 + Element Plus locale 映射（zh-CN / en-US）
- `design-tokens`：CSS 自定义属性、Element Plus 主题适配、Tailwind v4 `@theme` 注入
- `shared-ui`：基于 Element Plus 二次封装的 Vue3 组件（PageContainer、SidebarMenu、AuthButton）
- `shared-workflow`：bpmn-js 工作流引擎基础契约（实验性）
- `vue3-app`：正式宿主应用，composition root

### 状态管理分工

- **服务端状态**：`@tanstack/vue-query`（staleTime 5min、gcTime 30min、retry 3x 跳过 4xx、dev 环境仅 refetchOnWindowFocus）
- **客户端状态**：Pinia（仅用于 UI 状态：侧边栏折叠、主题偏好、表单草稿）

### HTTP 层（Port/Adapter 模式）

- `shared-utils` 定义 `HttpClient` 接口 → `ky-adapter.ts` 实现
- `shared-service` 仅消费接口，不直接依赖 ky
- 文件上传走原生 XHR 封装（`uploadWithProgress`）

### Mock 三模式

通过 `apps/vue3-app/.env.*` 环境变量控制：

| 模式 | VITE_ENABLE_MSW | VITE_PROXY_TARGET | 行为 |
|------|-----------------|-------------------|------|
| 纯 Mock（默认） | true | 不设 | MSW 拦截所有请求 |
| 纯后端 | false | http://localhost:48080 | Vite proxy 转发，MSW 关闭 |
| 混合 | true | http://localhost:48080 | MSW 处理已注册 handler，其余 fallthrough 到 proxy |

### 应用启动链

`apps/vue3-app/src/main.ts`：环境校验 → MSW 启动（dev） → design tokens 注入 → i18n → ElementPlus/Pinia/Router → VueQuery → 挂载

## 关键约束

1. **依赖方向不可逆**：基础包不依赖上层包，`shared-service` 不引入 Vue/DOM
2. **package exports 只指向 `dist/`**：开发/测试态通过 alias 消费源码可以，但对外契约必须 dist-based
3. **alias 单一真相源**：`apps/vue3-app/paths.config.ts` 定义所有 alias，修改 vite.config.ts 时必须同步 vitest.config.ts、paths.config.ts、tsconfig.app.json（`pnpm check:alias` 验证）
4. **UI 库锁定 Element Plus**：`design-tokens` 输出 Element Plus CSS 变量契约，`shared-ui` 基于 Element Plus 封装
5. **原子化 CSS 锁定 Tailwind CSS v4**：使用 `@tailwindcss/vite` 插件集成
6. **Mock 仅限开发/测试**：`@repo/shared-service/mock/browser` 在生产构建中被 Tree Shaking 剔除
7. **CSS 变量 kebab-case**：`design-tokens` 输出的 CSS 自定义属性必须 kebab-case，正式导出路径为 `./tokens.css` 和 `./element-plus-theme`

## 代码风格

- Prettier：`semi: false`、`singleQuote: true`、`printWidth: 100`、`trailingComma: 'all'`
- ESLint flat config：`@eslint/js` + `typescript-eslint` + `eslint-plugin-vue`
- Stylelint：SCSS standard + 属性排序
- Commit：Conventional Commits（commitlint 强制）
- Pre-commit：lint-staged（ESLint + Prettier + Stylelint）

## 关键文件

| 文件 | 用途 |
|------|------|
| `pnpm-workspace.yaml` | workspace 定义 + catalog 统一版本 |
| `tsconfig.base.json` | 全仓 TS 编译选项基座 |
| `apps/vue3-app/paths.config.ts` | alias 单一真相源 |
| `apps/vue3-app/vite.config.ts` | Vite 配置（含 proxy） |
| `scripts/vite.cjs` / `scripts/vitest.cjs` | Windows 兼容的 CLI 封装 |
| `AGENTS.md` | 维护约束完整文档 |
| `TEMPLATE.md` | Day 0 检查清单 |

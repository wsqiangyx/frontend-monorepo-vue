# 维护指南

本文件面向后续维护者、自动化工具和编码代理，定义这个仓库中不应被日常修改破坏的边界。

## 文档边界

- 根 `README.md`：模板消费者使用主文档
- 根 `CLAUDE.md`：AI 编码代理（Claude Code）指引入口
- 根 `AGENTS.md`：维护约束主文档
- 根 `TEMPLATE.md`：模板 Day 0 检查清单
- `docs/总体设计/Vue3 中后台前端平台 Monorepo 架构设计方案.md`：唯一上游概要设计主文档

如果修改仓库规则、模板使用方式、初始化步骤、正式公共契约或架构边界，优先修改根 `README.md`、根 `AGENTS.md`、根 `TEMPLATE.md` 与 `docs/总体设计/Vue3 中后台前端平台 Monorepo 架构设计方案.md`。

## 仓库定位

这是一个 Vue3 中后台前端平台脚手架 Monorepo，当前正式范围包括：

- 一个正式应用壳：`apps/vue3-app`
- 六个正式共享包：`packages/shared-utils`、`packages/shared-i18n`、`packages/shared-service`、`packages/design-tokens`、`packages/shared-ui`、`packages/shared-workflow`
- 一套统一工具链基线：TypeScript、Vite、Vitest、ESLint、Stylelint、Prettier、Husky、Commitlint

## 硬性约束

### 1. 不要破坏 workspace 脚本契约

- 根目录保留 `build`、`build:shared`、`build:vue`、`typecheck`、`lint`、`stylelint`、`test`
- 根目录保留 `check:alias`、`check:status`、`verify`
- 每个 app / package 都保留 `test`、`test:watch`、`test:coverage`

### 2. 保持依赖方向不可逆

```
vue3-app → shared-ui → shared-service → shared-utils
              ↓            ↓
          design-tokens  shared-i18n
```

- 基础共享层不依赖任何上层包
- `shared-service` 纯函数不依赖 Vue/DOM
- `shared-ui` 不反向定义平台规则

### 3. package 的 `exports` 仍然只指向 `dist`

所有共享包的 `exports` 都应只指向 `dist/`。
app 在开发态 / 测试态通过 alias 消费源码可以接受，但 package 对外契约仍然必须是 dist-based。

### 4. Vite 与 Vitest 的 alias / 插件链必须同步

如果你修改某个 app 的 `vite.config.ts`，同时检查：

- 对应的 `vitest.config.ts`
- 对应的 `paths.config.ts`
- 对应的 `tsconfig.app.json`

`apps/vue3-app/paths.config.ts` 是当前 app alias 的单一真相源。

### 5. 组件库选定 Element Plus

- `design-tokens` 输出 Element Plus CSS 变量契约
- `shared-ui` 组件基于 Element Plus 封装
- 国际化使用 `el-config-provider` + Element Plus locale

### 6. 保持 `design-tokens` 的职责收敛

- CSS 变量必须继续输出为 `kebab-case`
- `./tokens.css`、`./element-plus-theme` 为正式导出路径
- 不要在 app 内复制 token 逻辑
- 不要在 app 内复制 token 逻辑

### 7. `@repo/shared-service/mock/browser` 仅限开发/测试环境

- Mock 不是演示附件，而是平台初始化、登录、菜单、权限的正式替身数据来源
- 生产构建时 Tree Shaking 剔除
- 不要在 Vue app 内再写一套独立假数据源

### 8. 原子化 CSS 选定 Tailwind CSS

- 移除 UnoCSS，采用 Tailwind CSS v4
- 使用 `@tailwindcss/vite` 插件集成
- `design-tokens` 不再输出 UnoCSS 预设

### 9. 数据请求选型 ky + TanStack Vue Query

- HTTP 客户端从 axios 迁移到 ky（供应链安全、零依赖）
- 服务端状态管理采用 @tanstack/vue-query
- 文件上传使用原生 XHR 封装的 `uploadWithProgress`
- `shared-utils` 暴露 `HttpClient` 接口抽象，`shared-service` 仅消费接口而非直接依赖具体 HTTP 库

## 目录职责

### `apps/vue3-app`

- Vue3 + Element Plus 应用壳
- 启动链：环境校验 → Mock → design tokens 注入 → i18n → Router/Pinia → 挂载
- 主题通过 `el-config-provider` 接入

### `packages/design-tokens`

- CSS 自定义属性、Element Plus CSS 变量契约、图表配色常量
- 图表配色常量
- 移除 UnoCSS 预设（已从技术栈中排除）

### `packages/shared-utils`

- 日期格式化、数据校验、存储抽象、HttpClient 接口与 ky 适配器、uploadWithProgress（XHR 封装）、分级日志
- 浏览器 API 通过工厂函数注入

### `packages/shared-i18n`

- 中英文语言包、`createVueI18n` 初始化函数
- Element Plus locale 映射

### `packages/shared-service`

- API 模块、TokenManager、权限判断、Mock handlers
- 纯函数不依赖 Vue/DOM
- 仅依赖 `shared-utils` 暴露的 `HttpClient` 接口，不直接依赖 ky 或 axios

### `packages/shared-ui`

- Vue3 UI 组件封装
- 基于 Element Plus 二次封装

### `packages/shared-workflow`

- 工作流引擎基础契约
- Vue 组件封装属于后续阶段能力

# Day 0 检查清单

使用本模板仓库创建新项目后，请逐项确认以下内容。

## 基础检查

- [ ] 已通过 GitHub Template 或 clone 方式创建新仓库
- [ ] 已修改仓库名称与描述
- [ ] 已确认 Node.js 版本 `>=24.11.0 <25`
- [ ] 已启用 Corepack 并激活 pnpm `10.33.1`
- [ ] `pnpm install` 执行成功
- [ ] `pnpm dev:vue` 可正常启动

## 命名与标识

- [ ] 已修改 `package.json` 中的 `name` 字段
- [ ] 已考虑是否需要修改 `@repo/*` scope（可选，建议先跑通再改）
- [ ] 已修改 `README.md` 中的项目标题与描述

## 环境变量

- [ ] 已复制 `.env.example` 到 `apps/vue3-app/.env.development`
- [ ] 已确认 `VITE_API_BASE_URL` 配置（默认 `/api`）
- [ ] 已确认 `VITE_ENABLE_MSW` 设置（开发环境默认 `true`，mock 优先）
- [ ] 如需对接真实后端，已配置 `VITE_PROXY_TARGET` 并设置 `VITE_ENABLE_MSW=false`

## 文档

- [ ] 已阅读 `docs/总体设计/Vue3 中后台前端平台 Monorepo 架构设计方案.md`
- [ ] 已阅读 `AGENTS.md` 了解维护约束
- [ ] 已根据需要更新 `docs/教程/` 下的教程文档

## 验证

- [ ] `pnpm lint` 通过
- [ ] `pnpm typecheck` 通过
- [ ] `pnpm test` 通过
- [ ] `pnpm build` 通过
- [ ] `pnpm verify` 通过

## 可选操作

- [ ] 执行 `pnpm template:init` 进行最小初始化
- [ ] 配置 CI/CD 工作流
- [ ] 配置 CODEOWNERS
- [ ] 修改主题色与品牌标识

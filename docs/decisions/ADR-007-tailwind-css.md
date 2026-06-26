# ADR-007 采用 Tailwind CSS 替代 UnoCSS

- 状态：已采纳
- 日期：2026-06-26

## 背景

项目此前使用 UnoCSS 作为原子化 CSS 方案。UnoCSS 在性能和灵活性方面表现优秀，但经过评估发现以下问题：

- UnoCSS 社区规模远小于 Tailwind CSS，第三方资源（模板、组件库、教程）稀缺
- IDE 集成（VS Code 智能提示、自动补全）不如 Tailwind CSS 成熟
- Tailwind CSS v4 引入了 `@tailwindcss/vite` 原生 Vite 插件，构建性能已大幅提升
- Tailwind CSS v4 的 CSS-first 配置方式（`@theme` 指令）与项目 design-tokens 的 CSS 自定义属性体系更契合
- 团队多数成员对 Tailwind CSS 更熟悉

## 决策

移除 UnoCSS，采用 **Tailwind CSS v4** 作为原子化 CSS 方案。

集成方式：通过 `@tailwindcss/vite` 插件，而非 PostCSS 插件或 CLI。

## 替代方案

| 方案        | 评估                                                          |
| ----------- | ------------------------------------------------------------- |
| UnoCSS      | 性能优秀，灵活性高，但社区资源有限，IDE 支持不如 Tailwind CSS |
| Windi CSS   | 已停止维护，不纳入考虑                                        |
| 纯 CSS 变量 | 缺乏原子化 CSS 的 productivity 优势，不满足中后台快速开发需求 |

## 后果

- 移除 `uno.config.ts`，新增 Tailwind CSS 配置（通过 CSS `@theme` 指令或 `tailwind.config.ts`）
- Vite 插件从 `unocss/vite` 切换为 `@tailwindcss/vite`
- `design-tokens` 不再输出 UnoCSS 预设，改为通过 `@theme` 指令将设计令牌注入 Tailwind 主题
- `apps/vue3-app` 入口从 `import 'virtual:uno.css'` 改为引入 Tailwind CSS 入口样式
- 属性化语法（`presetAttributify`）不再可用，需全局迁移为 class 写法
- 移除根 `package.json` 中的 `unocss`、`@unocss/preset-uno`、`@unocss/preset-attributify`、`@unocss/reset` 依赖，新增 `tailwindcss` 和 `@tailwindcss/vite`

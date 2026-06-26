# ADR-003 选用 Element Plus 作为组件库

- 状态：已采纳
- 日期：2026-05-19（初选 TDesign），2026-06-26（迁移至 Element Plus）

## 背景

项目最初选用 TDesign Vue Next 作为 Vue3 组件库。经过一段时间使用和评估后发现：

- TDesign Vue Next 社区规模较小（GitHub ~4.2k stars），第三方教程和问题解决方案稀缺
- TDesign 的 CSS 变量定制方案（`--td-*`）与后续计划引入的 Tailwind CSS 存在部分重叠
- 团队成员对 Element Plus 更熟悉，学习成本更低

需要一套企业级 Vue3 组件库，要求：类型安全、主题可定制、社区活跃、与 Tailwind CSS 协同良好。

## 决策

舍 TDesign Vue Next，选用 **Element Plus** (`element-plus`)。

理由：

1.  **社区最大**：GitHub 25.4k+ stars，Vue3 生态中社区最活跃的组件库
2.  **组件最全**：覆盖中后台场景所需的所有基础组件（布局、表单、表格、弹窗、导航等）
3.  **生态最成熟**：第三方教程、模板、问题解答丰富，降低团队踩坑成本
4.  **主题可定制**：通过 CSS 变量（`--el-*`）体系进行主题定制，与 design-tokens 设计令牌体系天然契合
5.  **国际化内置**：通过 `el-config-provider` 注入 locale，与 `vue-i18n` 协同

## 替代方案

| 方案             | 评估                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| Naive UI         | TypeScript 支持更优，但社区中等（~16k stars），生态不如 Element Plus      |
| TDesign Vue Next | 腾讯出品，但社区规模小，第三方资源稀缺                                    |
| Ant Design Vue   | 社区大（~20k stars），但 API 风格偏 React，Vue 适配不如 Element Plus 原生 |

## 后果

- `design-tokens` 输出 Element Plus CSS 变量契约（`--el-*`），替代原有 `--td-*` 变量
- `shared-ui` 组件基于 Element Plus 封装，替代原有 TDesign 组件
- `shared-i18n` locale 映射基于 Element Plus locale，替代 TDesign locale
- `apps/vue3-app` 全局配置改用 `el-config-provider`，替代 `t-config-provider`
- 移除所有 TDesign 相关依赖（`tdesign-vue-next`）

## 迁移记录

- 2026-06-26：正式采纳迁移决策，设计文档同步更新

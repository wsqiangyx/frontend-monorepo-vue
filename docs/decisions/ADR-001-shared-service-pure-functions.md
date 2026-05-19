# ADR-001 `shared-service` 纯函数禁止依赖 UI 框架

- 状态：已采纳
- 日期：2026-05-10

## 结论

`shared-service` 中对外复用的规则函数保持纯函数，不依赖 Vue、DOM 或浏览器副作用。

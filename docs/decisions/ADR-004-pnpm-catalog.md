# ADR-004 pnpm catalog + overrides 统一版本管理

- 状态：已采纳
- 日期：2026-05-18（初始）；2026-05-20（补充 overrides）

## 结论

核心依赖版本统一声明在 `pnpm-workspace.yaml` 中，采用 **catalog + overrides** 双机制：

| 机制        | 用途                                                      | 示例                  |
| ----------- | --------------------------------------------------------- | --------------------- |
| `catalog`   | 声明共享依赖的版本范围，子包通过 `"dep": "catalog:"` 引用 | `vue: ^3.5`           |
| `overrides` | 精确定位关键工具链版本，强制所有子包统一                  | `typescript: '6.0.3'` |

### catalog 管理原则

- 适用于**多个子包共同依赖的运行时和构建依赖**（如 vue、vite、tdesign-vue-next）
- 声明宽松的 `^` 范围，实际版本以 `pnpm-lock.yaml` 锁定为准
- 子包无需各自维护版本号，统一使用 `"catalog:"` 引用

### overrides 管理原则

- 适用于**需全局统一固定版本的工具链**（如 typescript、eslint、vitest）
- 使用精确版本号，覆盖所有子包中声明的版本范围
- 当子包间出现间接依赖版本冲突时，优先通过 overrides 收敛

### 变更流程

- 新增多包共用依赖 → 优先加入 `catalog`
- 版本冲突或需全局固定版本 → 加入 `overrides`
- 升级时只需修改 `pnpm-workspace.yaml` 一处，再执行 `pnpm install` 更新 lock 文件

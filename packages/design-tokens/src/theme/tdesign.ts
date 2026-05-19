// ============================================================================
// @repo/design-tokens — TDesign 主题适配
// ============================================================================
// TDesign 通过 CSS 自定义属性进行主题定制，核心变量以 --td- 为前缀。
// 本模块将 design-tokens 的语义色/间距/圆角等映射为 TDesign CSS 变量覆盖，
// 供 t-config-provider 或 :root 样式注入使用。
//
// TDesign 主要 CSS 变量：
//   --td-brand-color          品牌色
//   --td-brand-color-hover    品牌色悬停
//   --td-brand-color-active   品牌色按下
//   --td-success-color        成功色
//   --td-warning-color        警告色
//   --td-error-color          错误色
//   --td-font-family          字体栈
//   --td-radius-small         小圆角
//   --td-radius-medium        中圆角
//   --td-radius-large         大圆角
// ============================================================================
import { colors } from '../colors'
import { radius } from '../radius'
import { typography } from '../typography'

export interface TDesignThemeVars {
  '--td-brand-color': string
  '--td-brand-color-hover': string
  '--td-brand-color-active': string
  '--td-success-color': string
  '--td-warning-color': string
  '--td-error-color': string
  '--td-font-family': string
  '--td-radius-small': string
  '--td-radius-medium': string
  '--td-radius-large': string
  '--td-font-size-body-small': string
  '--td-font-size-body-medium': string
  '--td-font-size-body-large': string
}

export function createTDesignThemeVars(): TDesignThemeVars {
  return {
    '--td-brand-color': colors.primary,
    '--td-brand-color-hover': colors.primaryHover,
    '--td-brand-color-active': colors.primaryPressed,
    '--td-success-color': colors.success,
    '--td-warning-color': colors.warning,
    '--td-error-color': colors.error,
    '--td-font-family': typography.fontFamily.base,
    '--td-radius-small': radius.sm,
    '--td-radius-medium': radius.md,
    '--td-radius-large': radius.lg,
    '--td-font-size-body-small': typography.fontSize.xs,
    '--td-font-size-body-medium': typography.fontSize.sm,
    '--td-font-size-body-large': typography.fontSize.base,
  }
}

export function generateTDesignThemeCss(): string {
  const vars = createTDesignThemeVars()
  const lines = Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`)
  return `:root {\n${lines.join('\n')}\n}`
}

// ============================================================================
// @repo/design-tokens -- Element Plus Theme Adapter
// ============================================================================
// Element Plus uses CSS custom properties with the `--el-` prefix for theming.
// This module maps design-tokens semantic tokens to Element Plus CSS variables.
// Usage: inject via :root or el-config-provider's :style prop.
// ============================================================================
import { colors } from '../colors'
import { radius } from '../radius'
import { typography } from '../typography'
import { shadows } from '../shadows'

export interface ElementPlusThemeVars {
  '--el-color-primary': string
  '--el-color-primary-light-3': string
  '--el-color-primary-light-5': string
  '--el-color-primary-light-7': string
  '--el-color-primary-dark-2': string
  '--el-color-success': string
  '--el-color-warning': string
  '--el-color-danger': string
  '--el-color-error': string
  '--el-color-info': string
  '--el-bg-color': string
  '--el-bg-color-overlay': string
  '--el-text-color-primary': string
  '--el-text-color-regular': string
  '--el-text-color-secondary': string
  '--el-text-color-placeholder': string
  '--el-border-color': string
  '--el-border-color-light': string
  '--el-border-radius-base': string
  '--el-border-radius-small': string
  '--el-font-size-base': string
  '--el-font-size-small': string
  '--el-font-size-extra-large': string
  '--el-font-weight-primary': string
  '--el-box-shadow': string
  '--el-box-shadow-light': string
}

export function createElementPlusThemeVars(): ElementPlusThemeVars {
  return {
    '--el-color-primary': colors.primary,
    '--el-color-primary-light-3': colors.primaryHover,
    '--el-color-primary-light-5': colors.neutral[100],
    '--el-color-primary-light-7': colors.neutral[50],
    '--el-color-primary-dark-2': colors.primaryPressed,
    '--el-color-success': colors.success,
    '--el-color-warning': colors.warning,
    '--el-color-danger': colors.error,
    '--el-color-error': colors.error,
    '--el-color-info': colors.info,
    '--el-bg-color': colors.bg.default,
    '--el-bg-color-overlay': colors.bg.elevated,
    '--el-text-color-primary': colors.text.primary,
    '--el-text-color-regular': colors.text.secondary,
    '--el-text-color-secondary': colors.text.tertiary,
    '--el-text-color-placeholder': colors.text.quaternary,
    '--el-border-color': colors.border.default,
    '--el-border-color-light': colors.border.secondary,
    '--el-border-radius-base': radius.md,
    '--el-border-radius-small': radius.sm,
    '--el-font-size-base': typography.fontSize.base,
    '--el-font-size-small': typography.fontSize.sm,
    '--el-font-size-extra-large': typography.fontSize.xl,
    '--el-font-weight-primary': '500',
    '--el-box-shadow': shadows.base,
    '--el-box-shadow-light': shadows.sm,
  }
}

export function generateElementPlusThemeCss(): string {
  const vars = createElementPlusThemeVars()
  const lines = Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`)
  return `:root {\n${lines.join('\n')}\n}`
}

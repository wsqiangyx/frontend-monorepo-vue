// ============================================================================
// @repo/shared-i18n -- Element Plus locale mapping
// ============================================================================
// Element Plus uses el-config-provider's locale prop to inject locale objects.
// This module exports the mapping function for Element Plus locale objects.
// Consuming code should supply the locale objects from element-plus/es/locale:
//   import zhCn from 'element-plus/es/locale/lang/zh-cn'
//   import en from 'element-plus/es/locale/lang/en'
// ============================================================================
import type { Locale } from './types'

export interface ElementPlusLocaleMap {
  'zh-CN': Record<string, unknown>
  'en-US': Record<string, unknown>
}

export function resolveElementPlusLocale(
  locale: Locale,
  localeMap: ElementPlusLocaleMap,
): Record<string, unknown> {
  return localeMap[locale] ?? localeMap['zh-CN']
}

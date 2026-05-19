// @repo/shared-i18n — TDesign locale 映射
// TDesign 通过 t-config-provider 的 global-config prop 接入 locale。
// 本模块导出对应语言的 locale 对象，供 app 层消费。

import type { Locale } from './types'

export interface TDesignLocaleMap {
  'zh-CN': Record<string, unknown>
  'en-US': Record<string, unknown>
}

/**
 * 获取 TDesign locale 对象。
 * 调用方需在 app 层动态导入对应的 locale 文件：
 *   import zhCN from 'tdesign-vue-next/es/locale/zh_CN'
 *   import enUS from 'tdesign-vue-next/es/locale/en_US'
 *
 * 本函数仅做映射分发，不静态依赖 tdesign-vue-next 的 locale 文件，
 * 避免 shared-i18n 产生对组件库的硬耦合。
 */
export function resolveTDesignLocale(
  locale: Locale,
  localeMap: TDesignLocaleMap,
): Record<string, unknown> {
  return localeMap[locale] ?? localeMap['zh-CN']
}

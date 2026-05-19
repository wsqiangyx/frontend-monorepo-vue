import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from './constants'
import { sharedMessages as messages } from './messages'
import type { Locale } from './types'

export function createVueI18n(locale?: Locale) {
  let savedLocale: Locale = DEFAULT_LOCALE
  try {
    if (typeof localStorage !== 'undefined') {
      savedLocale = (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale) || DEFAULT_LOCALE
    }
  } catch {
    // Ignore storage read failures
  }
  const currentLocale = locale || savedLocale

  return createI18n({
    legacy: false,
    locale: currentLocale,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  })
}

export type { Locale }
export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY }

import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from './constants'
import { sharedMessages } from './messages'
import { mergeMessages } from './messages'
import type { Locale, Messages } from './types'

export function createVueI18n(locale?: Locale, appMessages?: Messages) {
  let savedLocale: Locale = DEFAULT_LOCALE
  try {
    if (typeof localStorage !== 'undefined') {
      savedLocale = (localStorage.getItem(LOCALE_STORAGE_KEY) as Locale) || DEFAULT_LOCALE
    }
  } catch {
    // Ignore storage read failures
  }
  const currentLocale = locale || savedLocale
  const messages = appMessages ? mergeMessages(sharedMessages, appMessages) : sharedMessages

  return createI18n({
    legacy: false,
    locale: currentLocale,
    fallbackLocale: DEFAULT_LOCALE,
    messages,
  })
}

export type { Locale }
export { DEFAULT_LOCALE, LOCALE_STORAGE_KEY }

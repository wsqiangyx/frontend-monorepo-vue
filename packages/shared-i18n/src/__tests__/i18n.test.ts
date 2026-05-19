import { describe, it, expect } from 'vitest'
import { createVueI18n } from '../create-vue-i18n'
import { resolveTDesignLocale } from '../tdesign-locale'
import { normalizeLocale, detectBrowserLocale } from '../locale'
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from '../constants'
import { createTranslator } from '../translator'

describe('shared-i18n', () => {
  describe('createVueI18n', () => {
    it('creates an i18n instance with default locale', () => {
      const i18n = createVueI18n()
      expect(i18n).toBeDefined()
      expect(i18n.global.locale.value).toBe(DEFAULT_LOCALE)
    })

    it('creates an i18n instance with specified locale', () => {
      const i18n = createVueI18n('en-US')
      expect(i18n.global.locale.value).toBe('en-US')
    })
  })

  describe('resolveTDesignLocale', () => {
    const mockLocaleMap = {
      'zh-CN': { name: 'zh-CN' },
      'en-US': { name: 'en-US' },
    }

    it('returns correct locale for zh-CN', () => {
      expect(resolveTDesignLocale('zh-CN', mockLocaleMap)).toEqual({ name: 'zh-CN' })
    })

    it('returns correct locale for en-US', () => {
      expect(resolveTDesignLocale('en-US', mockLocaleMap)).toEqual({ name: 'en-US' })
    })

    it('falls back to zh-CN for unknown locale', () => {
      expect(resolveTDesignLocale('fr-FR' as 'zh-CN' | 'en-US', mockLocaleMap)).toEqual({
        name: 'zh-CN',
      })
    })
  })

  describe('locale helpers', () => {
    it('normalizeLocale handles zh variants', () => {
      expect(normalizeLocale('zh')).toBe('zh-CN')
      expect(normalizeLocale('zh-CN')).toBe('zh-CN')
      expect(normalizeLocale('ZH')).toBe('zh-CN')
    })

    it('normalizeLocale handles en variants', () => {
      expect(normalizeLocale('en')).toBe('en-US')
      expect(normalizeLocale('en-US')).toBe('en-US')
    })

    it('normalizeLocale defaults to zh-CN for unknown', () => {
      expect(normalizeLocale('fr')).toBe('zh-CN')
      expect(normalizeLocale(null)).toBe('zh-CN')
    })

    it('detectBrowserLocale returns a valid locale', () => {
      const locale = detectBrowserLocale()
      expect(['zh-CN', 'en-US']).toContain(locale)
    })
  })

  describe('constants', () => {
    it('exports correct defaults', () => {
      expect(DEFAULT_LOCALE).toBe('zh-CN')
      expect(LOCALE_STORAGE_KEY).toBe('repo-locale')
    })
  })

  describe('createTranslator', () => {
    it('creates translator with correct locale', () => {
      const messages = {
        'zh-CN': { hello: '你好' },
        'en-US': { hello: 'Hello' },
      }
      const t = createTranslator({ locale: 'zh-CN', messages })
      expect(t.locale).toBe('zh-CN')
      expect(t.t('hello')).toBe('你好')
    })

    it('falls back to fallback locale', () => {
      const messages = {
        'zh-CN': { hello: '你好' },
        'en-US': { hello: 'Hello' },
      }
      const t = createTranslator({ locale: 'en-US', messages })
      expect(t.t('hello')).toBe('Hello')
    })

    it('returns key when not found', () => {
      const messages = {
        'zh-CN': {},
        'en-US': {},
      }
      const t = createTranslator({ locale: 'zh-CN', messages })
      expect(t.t('missing.key')).toBe('missing.key')
    })
  })
})

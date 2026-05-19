import { describe, it, expect } from 'vitest'
import { buildQueryString, sleep } from '../index'

describe('shared-utils', () => {
  describe('buildQueryString', () => {
    it('builds query string from params', () => {
      expect(buildQueryString({ page: 1, keyword: 'test' })).toBe('page=1&keyword=test')
    })

    it('skips undefined values', () => {
      expect(buildQueryString({ page: 1, keyword: undefined })).toBe('page=1')
    })

    it('returns empty string for empty params', () => {
      expect(buildQueryString({})).toBe('')
    })
  })

  describe('sleep', () => {
    it('resolves after specified time', async () => {
      const start = Date.now()
      await sleep(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(40)
    })
  })
})

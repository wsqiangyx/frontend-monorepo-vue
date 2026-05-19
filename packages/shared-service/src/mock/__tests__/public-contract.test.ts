import { describe, expect, it } from 'vitest'
import packageJson from '../../../package.json'

describe('@repo/shared-service mock public contract', () => {
  it('declares the documented mock subpath exports in package.json', () => {
    expect(packageJson.exports).toHaveProperty('./mock')
    expect(packageJson.exports).toHaveProperty('./mock/browser')
    expect(packageJson.exports).toHaveProperty('./mock/server')
  })
})

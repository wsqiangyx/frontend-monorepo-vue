import { describe, expect, it } from 'vitest'
import { createNaiveThemeOverrides } from '../theme/naive'

describe('theme adapters', () => {
  it('maps snapshot fields into naive-ui theme overrides', () => {
    const overrides = createNaiveThemeOverrides()

    expect(overrides.common?.primaryColor).toBeDefined()
    expect(overrides.common?.borderRadius).toBeDefined()
    expect(overrides.common?.fontSize).toBeDefined()
  })
})

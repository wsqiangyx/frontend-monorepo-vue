import { describe, expect, it } from 'vitest'
import { createElementPlusThemeVars, generateElementPlusThemeCss } from '../theme/element-plus'

describe('theme adapters', () => {
  it('maps token fields into Element Plus CSS variables', () => {
    const vars = createElementPlusThemeVars()

    // Primary colors
    expect(vars['--el-color-primary']).toBeDefined()
    expect(vars['--el-color-primary-light-3']).toBeDefined()
    expect(vars['--el-color-primary-light-5']).toBeDefined()
    expect(vars['--el-color-primary-light-7']).toBeDefined()
    expect(vars['--el-color-primary-dark-2']).toBeDefined()

    // Semantic colors
    expect(vars['--el-color-success']).toBeDefined()
    expect(vars['--el-color-warning']).toBeDefined()
    expect(vars['--el-color-danger']).toBeDefined()
    expect(vars['--el-color-error']).toBeDefined()
    expect(vars['--el-color-info']).toBeDefined()

    // Background & text
    expect(vars['--el-bg-color']).toBeDefined()
    expect(vars['--el-bg-color-overlay']).toBeDefined()
    expect(vars['--el-text-color-primary']).toBeDefined()
    expect(vars['--el-text-color-regular']).toBeDefined()
    expect(vars['--el-text-color-secondary']).toBeDefined()
    expect(vars['--el-text-color-placeholder']).toBeDefined()

    // Border
    expect(vars['--el-border-color']).toBeDefined()
    expect(vars['--el-border-color-light']).toBeDefined()
    expect(vars['--el-border-radius-base']).toBeDefined()
    expect(vars['--el-border-radius-small']).toBeDefined()

    // Typography
    expect(vars['--el-font-size-base']).toBeDefined()
    expect(vars['--el-font-size-small']).toBeDefined()
    expect(vars['--el-font-size-extra-large']).toBeDefined()
    expect(vars['--el-font-weight-primary']).toBeDefined()

    // Shadows
    expect(vars['--el-box-shadow']).toBeDefined()
    expect(vars['--el-box-shadow-light']).toBeDefined()
  })

  it('maps token values correctly', () => {
    const vars = createElementPlusThemeVars()

    expect(vars['--el-color-primary']).toBe('#1677ff')
    expect(vars['--el-color-success']).toBe('#52c41a')
    expect(vars['--el-color-warning']).toBe('#faad14')
    expect(vars['--el-color-error']).toBe('#ff4d4f')
  })

  it('generates valid CSS string', () => {
    const css = generateElementPlusThemeCss()

    expect(css).toContain(':root {')
    expect(css).toContain('--el-color-primary:')
    expect(css).toContain('--el-border-radius-base:')
    expect(css).toContain('}')
  })
})

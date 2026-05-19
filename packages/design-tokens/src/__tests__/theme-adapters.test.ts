import { describe, expect, it } from 'vitest'
import { createTDesignThemeVars, generateTDesignThemeCss } from '../theme/tdesign'

describe('theme adapters', () => {
  it('maps token fields into TDesign CSS variables', () => {
    const vars = createTDesignThemeVars()

    expect(vars['--td-brand-color']).toBeDefined()
    expect(vars['--td-brand-color-hover']).toBeDefined()
    expect(vars['--td-brand-color-active']).toBeDefined()
    expect(vars['--td-success-color']).toBeDefined()
    expect(vars['--td-warning-color']).toBeDefined()
    expect(vars['--td-error-color']).toBeDefined()
    expect(vars['--td-font-family']).toBeDefined()
    expect(vars['--td-radius-small']).toBeDefined()
    expect(vars['--td-radius-medium']).toBeDefined()
    expect(vars['--td-radius-large']).toBeDefined()
  })

  it('generates valid CSS string', () => {
    const css = generateTDesignThemeCss()

    expect(css).toContain(':root {')
    expect(css).toContain('--td-brand-color:')
    expect(css).toContain('--td-radius-medium:')
    expect(css).toContain('}')
  })
})

import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json'
import { generateCssVarsString, tokensToCssVars } from '../to-css'
import { createTDesignThemeVars } from '../theme/tdesign'

describe('@repo/design-tokens formal export surfaces', () => {
  it('declares the documented subpath exports in package.json', () => {
    expect(packageJson.exports).toHaveProperty('./tokens.css')
    expect(packageJson.exports).toHaveProperty('./tdesign-theme')
    expect(packageJson.exports).toHaveProperty('./uno-preset')
  })

  it('provides token css content that can back the tokens.css subpath export', () => {
    const css = generateCssVarsString()

    expect(css).toContain(':root {')
    expect(css).toContain('--color-primary: #1677ff;')
    expect(css).toContain('--spacing-4: 16px;')
  })

  it('keeps the static tokens.css asset aligned with the generated token css', () => {
    const vars = tokensToCssVars()
    expect(generateCssVarsString().trim()).toContain('--spacing-0-5: 2px;')
    expect(generateCssVarsString().trim()).toContain('--spacing-24: 96px;')
    expect(vars['spacing-0-5']).toBe('2px')
    expect(vars['spacing-1-5']).toBe('6px')
    expect(vars['spacing-24']).toBe('96px')
    expect(packageJson.exports['./tokens.css'].default).toBe('./dist/tokens.css')
  })

  it('provides TDesign theme content for the tdesign-theme subpath export', () => {
    const vars = createTDesignThemeVars()

    expect(vars['--td-brand-color']).toBe('#1677ff')
    expect(vars['--td-radius-medium']).toBeDefined()
  })
})

import { generateCssVarsString } from '@repo/design-tokens'

const STYLE_ATTRIBUTE = 'data-design-tokens'

export function ensureDesignTokensLoaded() {
  if (typeof document === 'undefined') {
    return
  }

  const existingStyle = document.head.querySelector(`style[${STYLE_ATTRIBUTE}]`)
  if (existingStyle) {
    return
  }

  const style = document.createElement('style')
  style.setAttribute(STYLE_ATTRIBUTE, 'true')
  style.textContent = generateCssVarsString()
  document.head.appendChild(style)
}

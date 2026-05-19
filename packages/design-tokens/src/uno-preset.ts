import { presetAttributify, presetUno } from 'unocss'

export function createDesignTokensUnoPreset() {
  return [presetUno(), presetAttributify()]
}

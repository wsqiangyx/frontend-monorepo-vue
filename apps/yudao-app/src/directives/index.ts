import type { App } from 'vue'
import { permission } from './permission'
import { debounce } from './debounce'

export function setupDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('debounce', debounce)
}

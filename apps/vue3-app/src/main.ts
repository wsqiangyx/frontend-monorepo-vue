import './assets/main.css'
import 'element-plus/dist/index.css'

import { ensureDesignTokensLoaded } from './bootstrap/design-tokens'

import { validateEnv } from './bootstrap/env'
import { setupMock } from './bootstrap/mock'
import { createAppRuntime } from './bootstrap/runtime'
import { setupVueQuery } from './bootstrap/vue-query'

async function bootstrap() {
  validateEnv()
  await setupMock()
  ensureDesignTokensLoaded()

  const { app, router } = createAppRuntime()

  const { plugin, options } = setupVueQuery()
  app.use(plugin, options)

  await router.push('/')
  await router.isReady()
  app.mount('#app')
}

void bootstrap()

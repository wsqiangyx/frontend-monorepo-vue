import 'virtual:uno.css'
import './styles/index.css'

import { ensureDesignTokensLoaded } from './bootstrap/design-tokens'
import { validateEnv } from './bootstrap/env'
import { setupMock } from './bootstrap/mock'
import { createAppRuntime } from './bootstrap/runtime'

async function bootstrap() {
  validateEnv()
  await setupMock()
  ensureDesignTokensLoaded()

  const { app, router } = createAppRuntime()
  await router.push('/')
  await router.isReady()
  app.mount('#app')
}

void bootstrap()

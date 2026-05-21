import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

import { createVueI18n } from '@repo/shared-i18n'
import App from '../App.vue'
import { staticRoutes, asyncRoutes } from '../router'
import { setupRouterGuard } from '../router/guard'
import { setupDirectives } from '../directives'

export function createAppRuntime() {
  const i18n = createVueI18n()
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRoutes, ...asyncRoutes],
  })

  setupRouterGuard(router)

  const app = createApp(App)

  setupDirectives(app)
  app.use(TDesign)
  app.use(i18n)
  app.use(pinia)
  app.use(router)

  return {
    app,
    i18n,
    pinia,
    router,
  }
}

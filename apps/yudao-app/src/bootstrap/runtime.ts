import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { createVueI18n } from '@repo/shared-i18n'
import App from '../App.vue'
import { staticRoutes, asyncRoutes } from '../router'
import { setupRouterGuard } from '../router/guard'
import { setupDirectives } from '../directives'
import { appMessages } from '../locales'

export function createAppRuntime() {
  const i18n = createVueI18n(undefined, appMessages)
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(),
    routes: [...staticRoutes, ...asyncRoutes],
  })

  setupRouterGuard(router)

  const app = createApp(App)

  setupDirectives(app)
  app.use(ElementPlus)
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

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

import { createVueI18n } from '@repo/shared-i18n'
import App from './App.vue'

const i18n = createVueI18n()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/Home.vue'),
    },
  ],
})

const app = createApp(App)

app.use(TDesign)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.mount('#app')

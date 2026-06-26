import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import ElementPlus from 'element-plus'

import App from '../App.vue'
import Home from '../views/Home.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: { template: '<div>about</div>' } },
    ],
  })
}

function createTestI18n() {
  return createI18n({
    legacy: false,
    locale: 'zh-CN',
    fallbackLocale: 'zh-CN',
    messages: {
      'zh-CN': {},
      'en-US': {},
    },
  })
}

async function mountApp() {
  const router = createTestRouter()
  router.push('/')
  await router.isReady()

  const i18n = createTestI18n()
  const pinia = createPinia()

  const wrapper = mount(App, {
    global: {
      plugins: [router, i18n, pinia, ElementPlus],
    },
  })

  await flushPromises()
  await nextTick()

  return wrapper
}

describe('yudao-app', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts App with all plugins without error', async () => {
    const wrapper = await mountApp()
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })

  it('wraps content with Element Plus config provider', async () => {
    const wrapper = await mountApp()

    const configProvider = wrapper.findComponent({ name: 'ElConfigProvider' })
    expect(configProvider.exists()).toBe(true)

    wrapper.unmount()
  })
})

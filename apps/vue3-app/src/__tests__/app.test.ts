import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import TDesign from 'tdesign-vue-next'

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
      plugins: [router, i18n, pinia, TDesign],
    },
  })

  await flushPromises()
  await nextTick()

  return wrapper
}

describe('vue3-app', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts App with all plugins without error', async () => {
    const wrapper = await mountApp()
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders the default Home route with shared-ui PageContainer', async () => {
    const wrapper = await mountApp()

    expect(wrapper.find('.page-container').exists()).toBe(true)
    expect(wrapper.find('.page-container__title').text()).toBe('首页')

    wrapper.unmount()
  })

  it('renders shared-ui SidebarMenu with menu items', async () => {
    const wrapper = await mountApp()

    const menuText = wrapper.text()
    expect(menuText).toContain('首页')
    expect(menuText).toContain('系统管理')
    expect(menuText).toContain('仪表盘')

    wrapper.unmount()
  })

  it('renders the admin layout structure', async () => {
    const wrapper = await mountApp()

    const html = wrapper.html()
    expect(html).toContain('t-layout')
    expect(html).toContain('t-layout__sider')
    expect(html).toContain('t-layout__header')
    expect(html).toContain('t-layout__content')
    expect(html).toContain('admin-header__title')
    expect(html).toContain('Vue3 Admin')

    wrapper.unmount()
  })

  it('wraps content with TDesign config provider', async () => {
    const wrapper = await mountApp()

    const configProvider = wrapper.findComponent({ name: 'TConfigProvider' })
    expect(configProvider.exists()).toBe(true)

    wrapper.unmount()
  })

  it('has valid project structure with core dependencies', async () => {
    const vue = await import('vue')
    const vueRouter = await import('vue-router')
    const pinia = await import('pinia')

    expect(vue.createApp).toBeDefined()
    expect(vueRouter.createRouter).toBeDefined()
    expect(pinia.createPinia).toBeDefined()
  })
})

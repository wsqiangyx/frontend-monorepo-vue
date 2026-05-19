import { describe, it, expect } from 'vitest'

describe('vue3-app', () => {
  it('has valid project structure', async () => {
    // Verify core modules can be imported
    const vue = await import('vue')
    const vueRouter = await import('vue-router')
    const pinia = await import('pinia')

    expect(vue.createApp).toBeDefined()
    expect(vueRouter.createRouter).toBeDefined()
    expect(pinia.createPinia).toBeDefined()
  })
})

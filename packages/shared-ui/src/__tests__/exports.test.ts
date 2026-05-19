import { describe, it, expect } from 'vitest'

describe('shared-ui exports', () => {
  it('exports PageContainer', async () => {
    const mod = await import('../index')
    expect(mod.PageContainer).toBeDefined()
  })

  it('exports SidebarMenu', async () => {
    const mod = await import('../index')
    expect(mod.SidebarMenu).toBeDefined()
  })

  it('exports AuthButton', async () => {
    const mod = await import('../index')
    expect(mod.AuthButton).toBeDefined()
  })
})

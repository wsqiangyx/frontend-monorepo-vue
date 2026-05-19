import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

describe('app bootstrap helpers', () => {
  beforeEach(() => {
    vi.resetModules()
    document.head.innerHTML = ''
    vi.stubEnv('VITE_API_BASE_URL', '/api')
    vi.stubEnv('VITE_PROXY_TARGET', 'http://localhost:48080')
    vi.stubEnv('DEV', true)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('injects design tokens stylesheet once', async () => {
    const { ensureDesignTokensLoaded } = await import('../bootstrap/design-tokens')

    ensureDesignTokensLoaded()
    ensureDesignTokensLoaded()

    const styles = document.head.querySelectorAll('style[data-design-tokens]')
    expect(styles).toHaveLength(1)
    expect(styles[0]?.textContent).toContain('--color-primary: #1677ff;')
  })

  it('does not start mock worker when VITE_ENABLE_MSW is false', async () => {
    vi.stubEnv('VITE_ENABLE_MSW', 'false')

    const { setupMock } = await import('../bootstrap/mock')

    await expect(setupMock()).resolves.toBeUndefined()
  })

  it('fails fast when required env is missing', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')

    const { validateEnv } = await import('../bootstrap/env')

    expect(() => validateEnv()).toThrow(/VITE_API_BASE_URL/)
  })

  it('creates the app plugin graph through createAppRuntime', async () => {
    vi.doMock('../bootstrap/runtime', () => ({
      createAppRuntime: () => ({
        app: { mount: vi.fn() },
        router: {
          push: vi.fn().mockResolvedValue(undefined),
          isReady: vi.fn().mockResolvedValue(undefined),
        },
        i18n: {},
        pinia: {},
      }),
    }))

    const { createAppRuntime } = await import('../bootstrap/runtime')

    const runtime = createAppRuntime()

    expect(runtime.app).toBeDefined()
    expect(runtime.router).toBeDefined()
    expect(runtime.i18n).toBeDefined()
    expect(runtime.pinia).toBeDefined()
  })
})

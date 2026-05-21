import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

process.env.VITE_API_BASE_URL ??= '/api'
process.env.VITE_APP_TITLE ??= '芋道管理系统'

const handlers = [
  http.get('/api/system/meta', () => {
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'ok',
      data: { version: '0.0.0', title: '芋道管理系统' },
      timestamp: Date.now(),
    })
  }),
]

export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

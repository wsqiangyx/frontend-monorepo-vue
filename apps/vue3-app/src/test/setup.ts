import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/api/system/meta', () => {
    return HttpResponse.json({
      success: true,
      code: 200,
      message: 'ok',
      data: { version: '0.0.0', title: 'Vue3 Admin' },
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

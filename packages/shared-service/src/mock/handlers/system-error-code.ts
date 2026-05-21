// ============================================================================
// 错误码管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockErrorCodes = [
  {
    id: 1,
    type: 0,
    applicationName: 'yudao-app',
    code: 1001001001,
    message: '参数错误',
    memo: '通用参数校验错误',
    status: 0,
    createTime: '2026-01-01',
  },
  {
    id: 2,
    type: 0,
    applicationName: 'yudao-app',
    code: 1001001002,
    message: '数据不存在',
    memo: '请求的资源不存在',
    status: 0,
    createTime: '2026-01-01',
  },
  {
    id: 3,
    type: 1,
    applicationName: 'yudao-app',
    code: 1002000001,
    message: '用户未登录',
    memo: 'Token 无效或已过期',
    status: 0,
    createTime: '2026-01-01',
  },
  {
    id: 4,
    type: 1,
    applicationName: 'yudao-app',
    code: 1002000002,
    message: '权限不足',
    memo: '用户无权访问该资源',
    status: 0,
    createTime: '2026-01-01',
  },
]

let nextId = 5

export const systemErrorCodeHandlers = [
  // 错误码分页
  http.get('*/system/error-code/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const message = url.searchParams.get('message') ?? ''
    let filtered = [...mockErrorCodes]
    if (message) filtered = filtered.filter((e) => e.message.includes(message))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 错误码 CRUD
  http.get('*/system/error-code/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockErrorCodes.find((e) => e.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/error-code/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const item = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockErrorCodes)[0]
    mockErrorCodes.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/error-code/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockErrorCodes.findIndex((e) => e.id === body.id)
    if (index !== -1) Object.assign(mockErrorCodes[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/error-code/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockErrorCodes.findIndex((e) => e.id === id)
    if (index !== -1) mockErrorCodes.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

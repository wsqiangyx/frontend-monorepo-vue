// ============================================================================
// 岗位管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockPosts = [
  { id: 1, code: 'CEO', name: '董事长', sort: 1, status: 0, remark: '', createTime: '2026-01-01' },
  {
    id: 2,
    code: 'CTO',
    name: '技术总监',
    sort: 2,
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  { id: 3, code: 'HR', name: '人力资源', sort: 3, status: 0, remark: '', createTime: '2026-01-01' },
  {
    id: 4,
    code: 'USER',
    name: '普通员工',
    sort: 4,
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
]

let nextId = 5

export const systemPostHandlers = [
  http.get('*/system/post/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockPosts, mockPosts.length, pageNo, pageSize))
  }),

  http.get('*/system/post/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockPosts.map(({ id, name, code }) => ({ id, name, code }))))
  }),

  http.post('*/system/post/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const post = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockPosts)[0]
    mockPosts.push(post)
    return HttpResponse.json(success(post))
  }),

  http.put('*/system/post/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockPosts.findIndex((p) => p.id === body.id)
    if (index !== -1) Object.assign(mockPosts[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/post/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockPosts.findIndex((p) => p.id === id)
    if (index !== -1) mockPosts.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

// ============================================================================
// 角色管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockRoles = [
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    sort: 1,
    status: 0,
    type: 1,
    remark: '超级管理员角色',
    createTime: '2026-01-01',
    menuIds: [],
    dataScope: 1,
  },
  {
    id: 2,
    name: '普通角色',
    code: 'common',
    sort: 2,
    status: 0,
    type: 2,
    remark: '普通角色',
    createTime: '2026-01-01',
    menuIds: [1, 2, 3],
    dataScope: 2,
  },
  {
    id: 3,
    name: '审计员',
    code: 'auditor',
    sort: 3,
    status: 0,
    type: 2,
    remark: '审计角色',
    createTime: '2026-02-01',
    menuIds: [1],
    dataScope: 1,
  },
]

let nextId = 4

export const systemRoleHandlers = [
  http.get('*/system/role/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockRoles, mockRoles.length, pageNo, pageSize))
  }),

  http.get('*/system/role/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockRoles.map(({ id, name, code }) => ({ id, name, code }))))
  }),

  http.get('*/system/role/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const role = mockRoles.find((r) => r.id === id)
    if (!role)
      return HttpResponse.json(
        { success: false, code: '404', message: '角色不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(role))
  }),

  http.post('*/system/role/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const role = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockRoles)[0]
    mockRoles.push(role)
    return HttpResponse.json(success(role))
  }),

  http.put('*/system/role/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockRoles.findIndex((r) => r.id === body.id)
    if (index === -1)
      return HttpResponse.json(
        { success: false, code: '404', message: '角色不存在' },
        { status: 404 },
      )
    Object.assign(mockRoles[index], body)
    return HttpResponse.json(success(mockRoles[index]))
  }),

  http.delete('*/system/role/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockRoles.findIndex((r) => r.id === id)
    if (index !== -1) mockRoles.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

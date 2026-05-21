// ============================================================================
// 租户管理 + 租户套餐 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockTenantPackages = [
  {
    id: 1,
    name: '基础套餐',
    status: 0,
    remark: '基础功能包',
    menuIds: [1, 2, 3],
    createTime: '2026-01-01',
  },
  {
    id: 2,
    name: '专业套餐',
    status: 0,
    remark: '含工作流',
    menuIds: [1, 2, 3, 4, 5],
    createTime: '2026-01-01',
  },
]

const mockTenants = [
  {
    id: 1,
    name: '测试租户',
    contactName: '张三',
    contactMobile: '13800000001',
    packageId: 1,
    packageName: '基础套餐',
    accountNumber: 10,
    expireTime: '2027-01-01',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    name: '演示租户',
    contactName: '李四',
    contactMobile: '13800000002',
    packageId: 2,
    packageName: '专业套餐',
    accountNumber: 50,
    expireTime: '2027-06-01',
    status: 0,
    remark: '',
    createTime: '2026-02-01',
  },
]

let nextTenantId = 3
let nextPackageId = 3

export const systemTenantHandlers = [
  // 租户分页
  http.get('*/system/tenant/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const name = url.searchParams.get('name') ?? ''
    let filtered = [...mockTenants]
    if (name) filtered = filtered.filter((t) => t.name.includes(name))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  http.get('*/system/tenant/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockTenants.find((t) => t.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/tenant/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const pkg = mockTenantPackages.find((p) => p.id === body.packageId)
    const item = {
      id: nextTenantId++,
      ...body,
      packageName: pkg?.name ?? '',
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockTenants)[0]
    mockTenants.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/tenant/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockTenants.findIndex((t) => t.id === body.id)
    if (index !== -1) {
      const pkg = mockTenantPackages.find((p) => p.id === body.packageId)
      Object.assign(mockTenants[index], body, {
        packageName: pkg?.name ?? mockTenants[index].packageName,
      })
    }
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/tenant/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockTenants.findIndex((t) => t.id === id)
    if (index !== -1) mockTenants.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 租户套餐分页
  http.get('*/system/tenant-package/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(
      paginate(mockTenantPackages, mockTenantPackages.length, pageNo, pageSize),
    )
  }),

  // 租户套餐简单列表
  http.get('*/system/tenant-package/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockTenantPackages))
  }),

  http.get('*/system/tenant-package/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockTenantPackages.find((p) => p.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/tenant-package/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const item = {
      id: nextPackageId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockTenantPackages)[0]
    mockTenantPackages.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/tenant-package/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockTenantPackages.findIndex((p) => p.id === body.id)
    if (index !== -1) Object.assign(mockTenantPackages[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/tenant-package/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockTenantPackages.findIndex((p) => p.id === id)
    if (index !== -1) mockTenantPackages.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

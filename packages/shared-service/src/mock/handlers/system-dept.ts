// ============================================================================
// 部门管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success } from '../helpers'

interface MockDept {
  id: number
  name: string
  parentId: number
  sort: number
  status: number
  createTime: string
  leaderUserId?: number
  phone?: string
  email?: string
  children?: MockDept[]
}

const mockDepts: MockDept[] = [
  {
    id: 100,
    name: '总公司',
    parentId: 0,
    sort: 0,
    status: 0,
    createTime: '2026-01-01',
    children: [
      {
        id: 101,
        name: '研发部',
        parentId: 100,
        sort: 1,
        leaderUserId: 1,
        phone: '13800138000',
        email: 'dev@yudao.com',
        status: 0,
        createTime: '2026-01-01',
      },
      { id: 102, name: '测试部', parentId: 100, sort: 2, status: 0, createTime: '2026-01-01' },
      { id: 103, name: '市场部', parentId: 100, sort: 3, status: 0, createTime: '2026-01-01' },
      { id: 104, name: '财务部', parentId: 100, sort: 4, status: 0, createTime: '2026-01-01' },
    ],
  },
]

let nextId = 200

export const systemDeptHandlers = [
  http.get('*/system/dept/list', async () => {
    await delay(200)
    return HttpResponse.json(success(mockDepts))
  }),

  http.get('*/system/dept/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const dept = findDept(mockDepts, id)
    if (!dept)
      return HttpResponse.json(
        { success: false, code: '404', message: '部门不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(dept))
  }),

  http.post('*/system/dept/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const dept: MockDept = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as MockDept
    const parent = findDept(mockDepts, body.parentId as number)
    if (parent) {
      if (!parent.children) parent.children = []
      parent.children.push(dept)
    } else {
      mockDepts.push(dept)
    }
    return HttpResponse.json(success(dept))
  }),

  http.put('*/system/dept/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const dept = findDept(mockDepts, body.id as number)
    if (dept) Object.assign(dept, body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/dept/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    removeDept(mockDepts, id)
    return HttpResponse.json(success(true))
  }),
]

function findDept(depts: MockDept[], id: number): MockDept | undefined {
  for (const dept of depts) {
    if (dept.id === id) return dept
    if (dept.children?.length) {
      const found = findDept(dept.children, id)
      if (found) return found
    }
  }
  return undefined
}

function removeDept(depts: MockDept[], id: number): boolean {
  for (let i = 0; i < depts.length; i++) {
    if (depts[i].id === id) {
      depts.splice(i, 1)
      return true
    }
    if (depts[i].children?.length) {
      if (removeDept(depts[i].children!, id)) return true
    }
  }
  return false
}

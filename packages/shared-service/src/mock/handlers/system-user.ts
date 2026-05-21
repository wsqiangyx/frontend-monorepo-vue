// ============================================================================
// 用户管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    deptId: 100,
    deptName: '总公司',
    postIds: [1],
    email: 'admin@yudao.com',
    mobile: '13800138000',
    sex: 0,
    avatar: '',
    loginIp: '127.0.0.1',
    status: 0,
    remark: '超级管理员',
    loginDate: '2026-05-20',
    createTime: '2026-01-01',
    roles: ['admin'],
  },
  {
    id: 2,
    username: 'yudao',
    nickname: '芋道',
    deptId: 101,
    deptName: '研发部',
    postIds: [2],
    email: 'yudao@yudao.com',
    mobile: '13800138001',
    sex: 1,
    avatar: '',
    loginIp: '',
    status: 0,
    remark: '',
    loginDate: '',
    createTime: '2026-02-15',
    roles: ['common'],
  },
  {
    id: 3,
    username: 'test',
    nickname: '测试用户',
    deptId: 102,
    deptName: '测试部',
    postIds: [3],
    email: 'test@yudao.com',
    mobile: '13800138002',
    sex: 0,
    avatar: '',
    loginIp: '',
    status: 0,
    remark: '',
    loginDate: '',
    createTime: '2026-03-10',
    roles: ['common'],
  },
  {
    id: 4,
    username: 'wang',
    nickname: '王五',
    deptId: 101,
    deptName: '研发部',
    postIds: [2],
    email: 'wang@yudao.com',
    mobile: '13800138003',
    sex: 1,
    avatar: '',
    loginIp: '',
    status: 1,
    remark: '已禁用',
    loginDate: '',
    createTime: '2026-04-01',
    roles: ['common'],
  },
  {
    id: 5,
    username: 'li',
    nickname: '李四',
    deptId: 103,
    deptName: '市场部',
    postIds: [4],
    email: 'li@yudao.com',
    mobile: '13800138004',
    sex: 0,
    avatar: '',
    loginIp: '',
    status: 0,
    remark: '',
    loginDate: '',
    createTime: '2026-04-20',
    roles: ['common'],
  },
]

let nextId = 6

export const systemUserHandlers = [
  // 用户分页列表
  http.get('*/system/user/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const username = url.searchParams.get('username')
    const mobile = url.searchParams.get('mobile')
    const status = url.searchParams.get('status')

    let filtered = [...mockUsers]
    if (username) filtered = filtered.filter((u) => u.username.includes(username))
    if (mobile) filtered = filtered.filter((u) => u.mobile.includes(mobile))
    if (status !== null && status !== undefined && status !== '') {
      filtered = filtered.filter((u) => u.status === Number(status))
    }

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 用户详情
  http.get('*/system/user/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const user = mockUsers.find((u) => u.id === id)
    if (!user)
      return HttpResponse.json(
        { success: false, code: '404', message: '用户不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(user))
  }),

  // 新增用户
  http.post('*/system/user/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const user = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
      status: 0,
    } as (typeof mockUsers)[0]
    mockUsers.push(user)
    return HttpResponse.json(success(user))
  }),

  // 修改用户
  http.put('*/system/user/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockUsers.findIndex((u) => u.id === body.id)
    if (index === -1)
      return HttpResponse.json(
        { success: false, code: '404', message: '用户不存在' },
        { status: 404 },
      )
    Object.assign(mockUsers[index], body)
    return HttpResponse.json(success(mockUsers[index]))
  }),

  // 删除用户
  http.delete('*/system/user/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) mockUsers.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 重置密码
  http.put('*/system/user/update-password', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // 修改状态
  http.put('*/system/user/update-status', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as { id: number; status: number }
    const user = mockUsers.find((u) => u.id === body.id)
    if (user) user.status = body.status
    return HttpResponse.json(success(true))
  }),
]

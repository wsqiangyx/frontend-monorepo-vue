// ============================================================================
// 通知公告 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockNotices = [
  {
    id: 1,
    title: '系统升级通知',
    type: 1,
    content: '<p>系统将于本周六凌晨2点进行升级维护，预计耗时2小时。</p>',
    status: 0,
    remark: '',
    createTime: '2026-01-15',
  },
  {
    id: 2,
    title: '新功能上线公告',
    type: 1,
    content: '<p>工作流模块已上线，欢迎使用。</p>',
    status: 0,
    remark: '',
    createTime: '2026-02-01',
  },
  {
    id: 3,
    title: '密码安全提醒',
    type: 2,
    content: '<p>请定期修改密码，保障账户安全。</p>',
    status: 0,
    remark: '',
    createTime: '2026-03-10',
  },
]

let nextId = 4

export const systemNoticeHandlers = [
  // 通知公告分页
  http.get('*/system/notice/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const title = url.searchParams.get('title') ?? ''
    const type = url.searchParams.get('type')
    let filtered = [...mockNotices]
    if (title) filtered = filtered.filter((n) => n.title.includes(title))
    if (type !== null) filtered = filtered.filter((n) => n.type === Number(type))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 通知公告 CRUD
  http.get('*/system/notice/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const notice = mockNotices.find((n) => n.id === id)
    return HttpResponse.json(notice ? success(notice) : success(null))
  }),

  http.post('*/system/notice/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const notice = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockNotices)[0]
    mockNotices.push(notice)
    return HttpResponse.json(success(notice))
  }),

  http.put('*/system/notice/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockNotices.findIndex((n) => n.id === body.id)
    if (index !== -1) Object.assign(mockNotices[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/notice/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockNotices.findIndex((n) => n.id === id)
    if (index !== -1) mockNotices.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

// ============================================================================
// 邮件管理 Mock Handlers (账号 + 模板 + 日志)
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockAccounts = [
  {
    id: 1,
    mail: 'noreply@yudao.com',
    host: 'smtp.yudao.com',
    port: 465,
    sslEnabled: true,
    username: 'noreply@yudao.com',
    password: '***',
    fromName: '芋道系统',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
]

const mockTemplates = [
  {
    id: 1,
    name: '验证码邮件',
    accountId: 1,
    nickname: '芋道系统',
    title: '验证码',
    content: '<p>您的验证码是：${code}</p>',
    params: ['code'],
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    name: '通知邮件',
    accountId: 1,
    nickname: '芋道系统',
    title: '系统通知',
    content: '<p>${content}</p>',
    params: ['content'],
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
]

const mockLogs = [
  {
    id: 1,
    accountId: 1,
    templateId: 1,
    templateCode: 'mail_code',
    mail: 'test@example.com',
    subject: '验证码',
    content: '<p>您的验证码是：123456</p>',
    sendStatus: 0,
    sendTime: '2026-03-10 10:00:00',
    sendMessageId: 'msg-001',
    createTime: '2026-03-10 10:00:00',
  },
]

export const systemMailHandlers = [
  // 邮箱账号
  http.get('*/system/mail/account/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockAccounts, mockAccounts.length, pageNo, pageSize))
  }),

  http.get('*/system/mail/account/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockAccounts))
  }),

  http.get('*/system/mail/account/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockAccounts.find((a) => a.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/mail/account/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const item = {
      id: mockAccounts.length + 1,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockAccounts)[0]
    mockAccounts.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/mail/account/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockAccounts.findIndex((a) => a.id === body.id)
    if (index !== -1) Object.assign(mockAccounts[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/mail/account/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockAccounts.findIndex((a) => a.id === id)
    if (index !== -1) mockAccounts.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 邮件模板
  http.get('*/system/mail/template/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockTemplates, mockTemplates.length, pageNo, pageSize))
  }),

  http.get('*/system/mail/template/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockTemplates.find((t) => t.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/mail/template/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const item = {
      id: mockTemplates.length + 1,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockTemplates)[0]
    mockTemplates.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/mail/template/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockTemplates.findIndex((t) => t.id === body.id)
    if (index !== -1) Object.assign(mockTemplates[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/mail/template/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockTemplates.findIndex((t) => t.id === id)
    if (index !== -1) mockTemplates.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 邮件日志
  http.get('*/system/mail/log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockLogs, mockLogs.length, pageNo, pageSize))
  }),
]

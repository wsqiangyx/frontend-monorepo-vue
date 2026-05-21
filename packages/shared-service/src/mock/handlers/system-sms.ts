// ============================================================================
// 短信管理 Mock Handlers (渠道 + 模板 + 日志)
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockChannels = [
  {
    id: 1,
    signature: '芋道',
    code: 'aliyun',
    name: '阿里云短信',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    signature: '芋道',
    code: 'tencent',
    name: '腾讯云短信',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
]

const mockTemplates = [
  {
    id: 1,
    type: 0,
    code: 'SMS_00001',
    name: '验证码模板',
    content: '验证码：${code}，5分钟内有效',
    params: ['code'],
    status: 0,
    remark: '',
    channelId: 1,
    channelCode: 'aliyun',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    type: 1,
    code: 'SMS_00002',
    name: '通知模板',
    content: '您有一条新通知：${content}',
    params: ['content'],
    status: 0,
    remark: '',
    channelId: 1,
    channelCode: 'aliyun',
    createTime: '2026-01-01',
  },
]

const mockLogs = [
  {
    id: 1,
    channelId: 1,
    channelCode: 'aliyun',
    templateId: 1,
    templateCode: 'SMS_00001',
    templateType: 0,
    mobile: '13800000001',
    content: '验证码：123456，5分钟内有效',
    params: { code: '123456' },
    sendStatus: 0,
    sendTime: '2026-03-10 10:00:00',
    receiveStatus: 0,
    receiveTime: '2026-03-10 10:00:05',
    createTime: '2026-03-10 10:00:00',
  },
  {
    id: 2,
    channelId: 1,
    channelCode: 'aliyun',
    templateId: 2,
    templateCode: 'SMS_00002',
    templateType: 1,
    mobile: '13800000002',
    content: '您有一条新通知：系统升级',
    params: { content: '系统升级' },
    sendStatus: 0,
    sendTime: '2026-03-11 14:00:00',
    receiveStatus: 0,
    receiveTime: '2026-03-11 14:00:03',
    createTime: '2026-03-11 14:00:00',
  },
]

export const systemSmsHandlers = [
  // 短信渠道
  http.get('*/system/sms/channel/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockChannels, mockChannels.length, pageNo, pageSize))
  }),

  http.get('*/system/sms/channel/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockChannels))
  }),

  http.get('*/system/sms/channel/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockChannels.find((c) => c.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/sms/channel/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const item = {
      id: mockChannels.length + 1,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockChannels)[0]
    mockChannels.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/sms/channel/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockChannels.findIndex((c) => c.id === body.id)
    if (index !== -1) Object.assign(mockChannels[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/sms/channel/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockChannels.findIndex((c) => c.id === id)
    if (index !== -1) mockChannels.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 短信模板
  http.get('*/system/sms/template/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockTemplates, mockTemplates.length, pageNo, pageSize))
  }),

  http.get('*/system/sms/template/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockTemplates.find((t) => t.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/sms/template/create', async ({ request }) => {
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

  http.put('*/system/sms/template/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockTemplates.findIndex((t) => t.id === body.id)
    if (index !== -1) Object.assign(mockTemplates[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/sms/template/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockTemplates.findIndex((t) => t.id === id)
    if (index !== -1) mockTemplates.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 短信日志
  http.get('*/system/sms/log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const mobile = url.searchParams.get('mobile') ?? ''
    let filtered = [...mockLogs]
    if (mobile) filtered = filtered.filter((l) => l.mobile.includes(mobile))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),
]

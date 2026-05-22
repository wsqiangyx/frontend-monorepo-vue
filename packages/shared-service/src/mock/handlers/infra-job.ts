// ============================================================================
// 定时任务 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockJobs = [
  {
    id: 1,
    name: '用户 Session 清理',
    status: 1,
    handlerName: 'userSessionCleanup',
    handlerParam: '',
    cronExpression: '0 0 2 * * ?',
    retryCount: 3,
    retryInterval: 5000,
    monitorTimeout: 0,
    createTime: '2026-01-10',
  },
  {
    id: 2,
    name: '订单超时检查',
    status: 1,
    handlerName: 'orderTimeoutCheck',
    handlerParam: 'timeoutMinutes=30',
    cronExpression: '*/5 * * * * ?',
    retryCount: 0,
    retryInterval: 0,
    monitorTimeout: 0,
    createTime: '2026-01-15',
  },
  {
    id: 3,
    name: '数据备份',
    status: 0,
    handlerName: 'databaseBackup',
    handlerParam: 'type=full',
    cronExpression: '0 0 3 * * ?',
    retryCount: 1,
    retryInterval: 60000,
    monitorTimeout: 300,
    createTime: '2026-02-01',
  },
  {
    id: 4,
    name: '日志清理',
    status: 1,
    handlerName: 'logCleanup',
    handlerParam: 'days=30',
    cronExpression: '0 0 4 * * ?',
    retryCount: 0,
    retryInterval: 0,
    monitorTimeout: 0,
    createTime: '2026-02-15',
  },
  {
    id: 5,
    name: '报表生成',
    status: 1,
    handlerName: 'reportGenerate',
    handlerParam: 'type=daily',
    cronExpression: '0 30 8 * * ?',
    retryCount: 2,
    retryInterval: 10000,
    monitorTimeout: 600,
    createTime: '2026-03-01',
  },
]

const mockJobLogs = [
  {
    id: 1,
    jobId: 1,
    handlerName: 'userSessionCleanup',
    handlerParam: '',
    cronExpression: '0 0 2 * * ?',
    executeIndex: 45,
    beginTime: '2026-05-21 02:00:00',
    endTime: '2026-05-21 02:00:05',
    duration: 5000,
    status: 1,
    result: '清理 12 个过期 Session',
    createTime: '2026-05-21',
  },
  {
    id: 2,
    jobId: 2,
    handlerName: 'orderTimeoutCheck',
    handlerParam: 'timeoutMinutes=30',
    cronExpression: '*/5 * * * * ?',
    executeIndex: 1200,
    beginTime: '2026-05-21 10:00:00',
    endTime: '2026-05-21 10:00:02',
    duration: 2000,
    status: 1,
    result: '检查 0 个超时订单',
    createTime: '2026-05-21',
  },
  {
    id: 3,
    jobId: 3,
    handlerName: 'databaseBackup',
    handlerParam: 'type=full',
    cronExpression: '0 0 3 * * ?',
    executeIndex: 80,
    beginTime: '2026-05-21 03:00:00',
    endTime: '2026-05-21 03:05:30',
    duration: 330000,
    status: 1,
    result: '备份完成，文件大小 2.5GB',
    createTime: '2026-05-21',
  },
  {
    id: 4,
    jobId: 2,
    handlerName: 'orderTimeoutCheck',
    handlerParam: 'timeoutMinutes=30',
    cronExpression: '*/5 * * * * ?',
    executeIndex: 1201,
    beginTime: '2026-05-21 10:05:00',
    endTime: '2026-05-21 10:05:01',
    duration: 1000,
    status: 2,
    result: '执行超时',
    createTime: '2026-05-21',
  },
]

let nextJobId = 6

export const infraJobHandlers = [
  // 定时任务分页
  http.get('*/infra/job/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const name = url.searchParams.get('name')
    const status = url.searchParams.get('status')
    const handlerName = url.searchParams.get('handlerName')

    let filtered = [...mockJobs]
    if (name) filtered = filtered.filter((j) => j.name.includes(name))
    if (status !== null && status !== undefined && status !== '')
      filtered = filtered.filter((j) => j.status === Number(status))
    if (handlerName) filtered = filtered.filter((j) => j.handlerName.includes(handlerName))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 获取详情
  http.get('*/infra/job/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const job = mockJobs.find((j) => j.id === id)
    if (!job)
      return HttpResponse.json(
        { success: false, code: '404', message: '任务不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(job))
  }),

  // 新增
  http.post('*/infra/job/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const job = {
      id: nextJobId++,
      ...body,
      status: 1,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockJobs)[0]
    mockJobs.push(job)
    return HttpResponse.json(success(job))
  }),

  // 修改
  http.put('*/infra/job/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockJobs.findIndex((j) => j.id === body.id)
    if (index !== -1) Object.assign(mockJobs[index], body)
    return HttpResponse.json(success(true))
  }),

  // 删除
  http.delete('*/infra/job/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockJobs.findIndex((j) => j.id === id)
    if (index !== -1) mockJobs.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 批量删除
  http.delete('*/infra/job/delete-list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const ids = url.searchParams.get('ids')?.split(',').map(Number) ?? []
    for (const id of ids) {
      const index = mockJobs.findIndex((j) => j.id === id)
      if (index !== -1) mockJobs.splice(index, 1)
    }
    return HttpResponse.json(success(true))
  }),

  // 修改状态
  http.put('*/infra/job/update-status', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const status = Number(url.searchParams.get('status'))
    const job = mockJobs.find((j) => j.id === id)
    if (job) job.status = status
    return HttpResponse.json(success(true))
  }),

  // 立即执行
  http.put('*/infra/job/trigger', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // 导出
  http.get('*/infra/job/export', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),

  // 任务日志分页
  http.get('*/infra/job-log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const jobId = url.searchParams.get('jobId')

    let filtered = [...mockJobLogs]
    if (jobId) filtered = filtered.filter((l) => l.jobId === Number(jobId))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 清空日志
  http.delete('*/infra/job-log/clean', async () => {
    await delay(200)
    mockJobLogs.length = 0
    return HttpResponse.json(success(true))
  }),
]

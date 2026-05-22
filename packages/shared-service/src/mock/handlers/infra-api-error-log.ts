// ============================================================================
// API 错误日志 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockErrorLogs = [
  {
    id: 1,
    userId: 2,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'POST',
    requestUrl: '/system/user/create',
    exceptionName: 'DataIntegrityViolationException',
    exceptionMessage: "Duplicate entry 'test' for key 'uk_username'",
    exceptionStackTrace: 'org.springframework.dao.DataIntegrityViolationException: ...',
    exceptionTime: '2026-05-21 16:30:00',
    processStatus: 0,
    processTime: '',
    processUserId: 0,
    resultCode: 1001001,
    resultMsg: '用户名已存在',
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
    createTime: '2026-05-21',
  },
  {
    id: 2,
    userId: 1,
    userType: 2,
    applicationName: 'infra-server',
    requestMethod: 'GET',
    requestUrl: '/infra/codegen/preview?tableId=999',
    exceptionName: 'NullPointerException',
    exceptionMessage: 'Table not found: 999',
    exceptionStackTrace: 'java.lang.NullPointerException: ...',
    exceptionTime: '2026-05-21 15:10:00',
    processStatus: 1,
    processTime: '2026-05-21 16:00:00',
    processUserId: 1,
    resultCode: 500,
    resultMsg: '系统内部错误',
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
    createTime: '2026-05-21',
  },
  {
    id: 3,
    userId: 3,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'PUT',
    requestUrl: '/system/role/update',
    exceptionName: 'OptimisticLockingFailureException',
    exceptionMessage: '数据已被修改，请刷新后重试',
    exceptionStackTrace: 'org.springframework.orm.ObjectOptimisticLockingFailureException: ...',
    exceptionTime: '2026-05-22 09:30:00',
    processStatus: 0,
    processTime: '',
    processUserId: 0,
    resultCode: 1001002,
    resultMsg: '并发冲突',
    userIp: '192.168.1.101',
    userAgent: 'Chrome/120',
    createTime: '2026-05-22',
  },
  {
    id: 4,
    userId: 1,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'DELETE',
    requestUrl: '/system/dept/delete?id=100',
    exceptionName: 'ServiceException',
    exceptionMessage: '该部门下存在子部门，不允许删除',
    exceptionStackTrace: 'cn.iocoder.yudao.framework.common.exception.ServiceException: ...',
    exceptionTime: '2026-05-22 10:00:00',
    processStatus: 2,
    processTime: '2026-05-22 10:05:00',
    processUserId: 1,
    resultCode: 1001003,
    resultMsg: '存在子部门',
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
    createTime: '2026-05-22',
  },
  {
    id: 5,
    userId: 2,
    userType: 2,
    applicationName: 'infra-server',
    requestMethod: 'POST',
    requestUrl: '/infra/file/upload',
    exceptionName: 'FileSizeLimitExceededException',
    exceptionMessage: '文件大小超出限制: 50MB',
    exceptionStackTrace: 'org.springframework.web.multipart.FileSizeLimitExceededException: ...',
    exceptionTime: '2026-05-22 11:00:00',
    processStatus: 0,
    processTime: '',
    processUserId: 0,
    resultCode: 500,
    resultMsg: '文件过大',
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
    createTime: '2026-05-22',
  },
]

export const infraApiErrorLogHandlers = [
  // 错误日志分页
  http.get('*/infra/api-error-log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const userId = url.searchParams.get('userId')
    const userType = url.searchParams.get('userType')
    const applicationName = url.searchParams.get('applicationName')
    const processStatus = url.searchParams.get('processStatus')

    let filtered = [...mockErrorLogs]
    if (userId) filtered = filtered.filter((l) => l.userId === Number(userId))
    if (userType) filtered = filtered.filter((l) => l.userType === Number(userType))
    if (applicationName)
      filtered = filtered.filter((l) => l.applicationName.includes(applicationName))
    if (processStatus !== null && processStatus !== undefined && processStatus !== '')
      filtered = filtered.filter((l) => l.processStatus === Number(processStatus))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 获取详情
  http.get('*/infra/api-error-log/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const log = mockErrorLogs.find((l) => l.id === id)
    if (!log)
      return HttpResponse.json(
        { success: false, code: '404', message: '日志不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(log))
  }),

  // 更新处理状态
  http.put('*/infra/api-error-log/update-status', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const processStatus = Number(url.searchParams.get('processStatus'))
    const log = mockErrorLogs.find((l) => l.id === id)
    if (log) {
      log.processStatus = processStatus
      log.processTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
      log.processUserId = 1
    }
    return HttpResponse.json(success(true))
  }),

  // 导出
  http.get('*/infra/api-error-log/export', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),
]

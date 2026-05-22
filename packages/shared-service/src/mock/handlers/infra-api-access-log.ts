// ============================================================================
// API 访问日志 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockAccessLogs = [
  {
    id: 1,
    userId: 1,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'GET',
    requestUrl: '/system/user/page',
    beginTime: '2026-05-21 10:30:01',
    endTime: '2026-05-21 10:30:01',
    duration: 45,
    resultCode: 0,
    resultMsg: '',
    operateModule: '用户管理',
    operateName: '查询用户列表',
    operateType: 1,
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
  },
  {
    id: 2,
    userId: 1,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'POST',
    requestUrl: '/system/user/create',
    beginTime: '2026-05-21 10:31:15',
    endTime: '2026-05-21 10:31:15',
    duration: 120,
    resultCode: 0,
    resultMsg: '',
    operateModule: '用户管理',
    operateName: '新增用户',
    operateType: 2,
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
  },
  {
    id: 3,
    userId: 2,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'PUT',
    requestUrl: '/system/user/update',
    beginTime: '2026-05-21 11:00:30',
    endTime: '2026-05-21 11:00:30',
    duration: 88,
    resultCode: 0,
    resultMsg: '',
    operateModule: '用户管理',
    operateName: '修改用户',
    operateType: 3,
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
  },
  {
    id: 4,
    userId: 1,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'GET',
    requestUrl: '/system/role/page',
    beginTime: '2026-05-21 14:00:00',
    endTime: '2026-05-21 14:00:00',
    duration: 35,
    resultCode: 0,
    resultMsg: '',
    operateModule: '角色管理',
    operateName: '查询角色列表',
    operateType: 1,
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
  },
  {
    id: 5,
    userId: 1,
    userType: 2,
    applicationName: 'infra-server',
    requestMethod: 'GET',
    requestUrl: '/infra/codegen/table/page',
    beginTime: '2026-05-21 15:00:00',
    endTime: '2026-05-21 15:00:00',
    duration: 65,
    resultCode: 0,
    resultMsg: '',
    operateModule: '代码生成',
    operateName: '查询表列表',
    operateType: 1,
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
  },
  {
    id: 6,
    userId: 3,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'DELETE',
    requestUrl: '/system/user/delete?id=5',
    beginTime: '2026-05-21 16:20:00',
    endTime: '2026-05-21 16:20:00',
    duration: 52,
    resultCode: 0,
    resultMsg: '',
    operateModule: '用户管理',
    operateName: '删除用户',
    operateType: 4,
    userIp: '192.168.1.101',
    userAgent: 'Chrome/120',
  },
  {
    id: 7,
    userId: 2,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'POST',
    requestUrl: '/system/user/create',
    beginTime: '2026-05-21 16:30:00',
    endTime: '2026-05-21 16:30:00',
    duration: 150,
    resultCode: 1001001,
    resultMsg: '用户名已存在',
    operateModule: '用户管理',
    operateName: '新增用户',
    operateType: 2,
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
  },
  {
    id: 8,
    userId: 1,
    userType: 2,
    applicationName: 'system-server',
    requestMethod: 'GET',
    requestUrl: '/system/dept/list',
    beginTime: '2026-05-22 09:00:00',
    endTime: '2026-05-22 09:00:00',
    duration: 25,
    resultCode: 0,
    resultMsg: '',
    operateModule: '部门管理',
    operateName: '查询部门列表',
    operateType: 1,
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
  },
]

export const infraApiAccessLogHandlers = [
  // 访问日志分页
  http.get('*/infra/api-access-log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const userId = url.searchParams.get('userId')
    const userType = url.searchParams.get('userType')
    const applicationName = url.searchParams.get('applicationName')
    const resultCode = url.searchParams.get('resultCode')

    let filtered = [...mockAccessLogs]
    if (userId) filtered = filtered.filter((l) => l.userId === Number(userId))
    if (userType) filtered = filtered.filter((l) => l.userType === Number(userType))
    if (applicationName)
      filtered = filtered.filter((l) => l.applicationName.includes(applicationName))
    if (resultCode !== null && resultCode !== undefined && resultCode !== '')
      filtered = filtered.filter((l) => l.resultCode === Number(resultCode))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 获取详情
  http.get('*/infra/api-access-log/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const log = mockAccessLogs.find((l) => l.id === id)
    if (!log)
      return HttpResponse.json(
        { success: false, code: '404', message: '日志不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(log))
  }),

  // 导出
  http.get('*/infra/api-access-log/export', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),
]

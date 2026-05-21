// ============================================================================
// 操作日志 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { paginate } from '../helpers'

const mockLogs = [
  {
    id: 1,
    userId: 1,
    userType: 2,
    userName: 'admin',
    bizType: 1,
    bizId: 1,
    action: '创建用户',
    method: 'com.yudao.service.system.controller.admin.user.AdminUserController.create',
    httpMethod: 'POST',
    url: '/system/user/create',
    bizData: '{"username":"test"}',
    resultCode: 0,
    resultMsg: '',
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
    duration: 50,
    createTime: '2026-03-10 10:00:00',
  },
  {
    id: 2,
    userId: 1,
    userType: 2,
    userName: 'admin',
    bizType: 2,
    bizId: 1,
    action: '修改角色',
    method: 'com.yudao.service.system.controller.admin.role.AdminRoleController.update',
    httpMethod: 'PUT',
    url: '/system/role/update',
    bizData: '{"name":"管理员"}',
    resultCode: 0,
    resultMsg: '',
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
    duration: 30,
    createTime: '2026-03-10 11:00:00',
  },
  {
    id: 3,
    userId: 2,
    userType: 2,
    userName: 'test',
    bizType: 1,
    bizId: 2,
    action: '删除用户',
    method: 'com.yudao.service.system.controller.admin.user.AdminUserController.delete',
    httpMethod: 'DELETE',
    url: '/system/user/delete?id=2',
    bizData: '',
    resultCode: 0,
    resultMsg: '',
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
    duration: 20,
    createTime: '2026-03-11 09:00:00',
  },
]

export const systemOperateLogHandlers = [
  http.get('*/system/operate-log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const action = url.searchParams.get('action') ?? ''
    let filtered = [...mockLogs]
    if (action) filtered = filtered.filter((l) => l.action.includes(action))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),
]

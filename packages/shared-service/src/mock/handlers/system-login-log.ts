// ============================================================================
// 登录日志 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { paginate } from '../helpers'

const mockLogs = [
  {
    id: 1,
    userId: 1,
    userType: 2,
    username: 'admin',
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
    loginType: 0,
    resultCode: 0,
    resultMsg: '登录成功',
    loginDate: '2026-03-10',
    createTime: '2026-03-10 09:00:00',
  },
  {
    id: 2,
    userId: 2,
    userType: 2,
    username: 'test',
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
    loginType: 0,
    resultCode: 0,
    resultMsg: '登录成功',
    loginDate: '2026-03-10',
    createTime: '2026-03-10 10:00:00',
  },
  {
    id: 3,
    userId: 0,
    userType: 2,
    username: 'unknown',
    userIp: '10.0.0.1',
    userAgent: 'Chrome/120',
    loginType: 0,
    resultCode: 1002000001,
    resultMsg: '用户不存在',
    loginDate: '2026-03-11',
    createTime: '2026-03-11 08:00:00',
  },
]

export const systemLoginLogHandlers = [
  http.get('*/system/login-log/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const username = url.searchParams.get('username') ?? ''
    let filtered = [...mockLogs]
    if (username) filtered = filtered.filter((l) => l.username.includes(username))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),
]

// ============================================================================
// OAuth2 应用管理 + 在线用户 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockClients = [
  {
    id: 1,
    clientId: 'yudao-app',
    clientKey: 'yudao-app',
    clientSecret: 'test-secret',
    name: '芋道管理后台',
    logo: '',
    description: '管理后台应用',
    status: 0,
    accessTokenValiditySeconds: 7200,
    refreshTokenValiditySeconds: 2592000,
    redirectUris: ['http://localhost:3000/callback'],
    autoApproveScopes: ['read'],
    authorizedGrantTypes: ['authorization_code', 'refresh_token'],
    scopes: ['read', 'write'],
    authorities: [],
    resourceIds: [],
    additionalInformation: '',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    clientId: 'yudao-app-client',
    clientKey: 'yudao-app-client',
    clientSecret: 'test-secret-2',
    name: '芋道移动端',
    logo: '',
    description: '移动端应用',
    status: 0,
    accessTokenValiditySeconds: 7200,
    refreshTokenValiditySeconds: 2592000,
    redirectUris: ['yudao://callback'],
    autoApproveScopes: ['read'],
    authorizedGrantTypes: ['authorization_code', 'refresh_token'],
    scopes: ['read'],
    authorities: [],
    resourceIds: [],
    additionalInformation: '',
    createTime: '2026-01-01',
  },
]

const mockOnlineUsers = [
  {
    id: 1,
    userId: 1,
    userType: 2,
    username: 'admin',
    userIp: '127.0.0.1',
    userAgent: 'Chrome/120',
    loginTime: '2026-03-10 09:00:00',
  },
  {
    id: 2,
    userId: 2,
    userType: 2,
    username: 'test',
    userIp: '192.168.1.100',
    userAgent: 'Firefox/121',
    loginTime: '2026-03-10 10:00:00',
  },
]

let nextClientId = 3

export const systemOAuth2Handlers = [
  // OAuth2 客户端
  http.get('*/system/oauth2/client/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const name = url.searchParams.get('name') ?? ''
    let filtered = [...mockClients]
    if (name) filtered = filtered.filter((c) => c.name.includes(name))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  http.get('*/system/oauth2/client/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const item = mockClients.find((c) => c.id === id)
    return HttpResponse.json(item ? success(item) : success(null))
  }),

  http.post('*/system/oauth2/client/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const item = {
      id: nextClientId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockClients)[0]
    mockClients.push(item)
    return HttpResponse.json(success(item))
  }),

  http.put('*/system/oauth2/client/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockClients.findIndex((c) => c.id === body.id)
    if (index !== -1) Object.assign(mockClients[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/oauth2/client/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockClients.findIndex((c) => c.id === id)
    if (index !== -1) mockClients.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 在线用户
  http.get('*/system/online-user/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const username = url.searchParams.get('username') ?? ''
    let filtered = [...mockOnlineUsers]
    if (username) filtered = filtered.filter((u) => u.username.includes(username))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  http.delete('*/system/online-user/kick', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockOnlineUsers.findIndex((u) => u.id === id)
    if (index !== -1) mockOnlineUsers.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

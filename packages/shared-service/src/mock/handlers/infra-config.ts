// ============================================================================
// 配置管理 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockConfigs = [
  {
    id: 1,
    category: '系统',
    name: '用户初始密码',
    key: 'sys.user.init-password',
    value: 'admin123',
    visible: true,
    type: 1,
    remark: '用户初始化密码',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    category: '系统',
    name: '账号最大登录错误次数',
    key: 'sys.login.max-reset-error-count',
    value: '5',
    visible: true,
    type: 1,
    remark: '超过次数后锁定账号',
    createTime: '2026-01-01',
  },
  {
    id: 3,
    category: '系统',
    name: '密码错误锁定时间',
    key: 'sys.login.max-reset-error-time',
    value: '10',
    visible: true,
    type: 1,
    remark: '单位：分钟',
    createTime: '2026-01-01',
  },
  {
    id: 4,
    category: '安全',
    name: '验证码开关',
    key: 'sys.captcha.enabled',
    value: 'true',
    visible: true,
    type: 1,
    remark: '是否开启验证码',
    createTime: '2026-01-01',
  },
  {
    id: 5,
    category: '安全',
    name: '短信验证码开关',
    key: 'sys.sms.enabled',
    value: 'false',
    visible: false,
    type: 0,
    remark: '短信登录验证码',
    createTime: '2026-01-15',
  },
  {
    id: 6,
    category: '业务',
    name: '商品库存预警数',
    key: 'biz.product.stock-warning',
    value: '100',
    visible: false,
    type: 0,
    remark: '库存低于此值预警',
    createTime: '2026-02-01',
  },
  {
    id: 7,
    category: '业务',
    name: '订单超时时间',
    key: 'biz.order.timeout-minutes',
    value: '30',
    visible: false,
    type: 0,
    remark: '订单未支付超时自动关闭',
    createTime: '2026-02-01',
  },
]

let nextId = 8

export const infraConfigHandlers = [
  // 配置分页
  http.get('*/infra/config/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const name = url.searchParams.get('name')
    const key = url.searchParams.get('key')
    const type = url.searchParams.get('type')

    let filtered = [...mockConfigs]
    if (name) filtered = filtered.filter((c) => c.name.includes(name))
    if (key) filtered = filtered.filter((c) => c.key.includes(key))
    if (type !== null && type !== undefined && type !== '')
      filtered = filtered.filter((c) => c.type === Number(type))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 获取详情
  http.get('*/infra/config/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const config = mockConfigs.find((c) => c.id === id)
    if (!config)
      return HttpResponse.json(
        { success: false, code: '404', message: '配置不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(config))
  }),

  // 根据 key 获取值
  http.get('*/infra/config/get-value', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const key = url.searchParams.get('key')
    const config = mockConfigs.find((c) => c.key === key)
    return HttpResponse.json(success(config?.value ?? ''))
  }),

  // 新增
  http.post('*/infra/config/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const config = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockConfigs)[0]
    mockConfigs.push(config)
    return HttpResponse.json(success(config))
  }),

  // 修改
  http.put('*/infra/config/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockConfigs.findIndex((c) => c.id === body.id)
    if (index !== -1) Object.assign(mockConfigs[index], body)
    return HttpResponse.json(success(true))
  }),

  // 删除
  http.delete('*/infra/config/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockConfigs.findIndex((c) => c.id === id)
    if (index !== -1) mockConfigs.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 批量删除
  http.delete('*/infra/config/delete-list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const ids = url.searchParams.get('ids')?.split(',').map(Number) ?? []
    for (const id of ids) {
      const index = mockConfigs.findIndex((c) => c.id === id)
      if (index !== -1) mockConfigs.splice(index, 1)
    }
    return HttpResponse.json(success(true))
  }),

  // 导出
  http.get('*/infra/config/export', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),
]

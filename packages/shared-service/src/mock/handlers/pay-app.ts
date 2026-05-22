import { http, HttpResponse } from 'msw'
import { success, paginate, fail } from '../helpers'

// --- Pay App ---
let nextAppId = 3
const apps = [
  {
    id: 1,
    appKey: 'PAY_APP_001',
    name: '商城支付应用',
    status: 0,
    remark: '商城主支付',
    payNotifyUrl: 'https://shop.example.com/pay/notify',
    refundNotifyUrl: 'https://shop.example.com/refund/notify',
    transferNotifyUrl: '',
    merchantId: 1,
    merchantName: '测试商户',
    createTime: '2024-01-10 10:00:00',
  },
  {
    id: 2,
    appKey: 'PAY_APP_002',
    name: '会员充值应用',
    status: 0,
    remark: '会员充值',
    payNotifyUrl: 'https://member.example.com/pay/notify',
    refundNotifyUrl: '',
    transferNotifyUrl: '',
    merchantId: 1,
    merchantName: '测试商户',
    createTime: '2024-02-15 14:30:00',
  },
]

// --- Pay Channel ---
const channels = [
  {
    id: 1,
    code: 'alipay',
    config: '{"appId":"2021001100001"}',
    status: 0,
    remark: '支付宝',
    feeRate: 0.6,
    appId: 1,
    createTime: '2024-01-10 10:00:00',
  },
  {
    id: 2,
    code: 'wxpay',
    config: '{"mchId":"1234567890"}',
    status: 0,
    remark: '微信支付',
    feeRate: 0.6,
    appId: 1,
    createTime: '2024-01-10 10:00:00',
  },
  {
    id: 3,
    code: 'alipay',
    config: '{"appId":"2021001100002"}',
    status: 0,
    remark: '支付宝-会员',
    feeRate: 0.6,
    appId: 2,
    createTime: '2024-02-15 14:30:00',
  },
]

// --- Pay Order ---
const orders = [
  {
    id: 1,
    merchantId: 1,
    appId: 1,
    channelId: 1,
    channelCode: 'alipay',
    merchantOrderId: 'ORD20240301001',
    subject: '商品订单-手机',
    body: 'iPhone 15 Pro',
    notifyUrl: '',
    notifyStatus: 20,
    amount: 899900,
    channelFeeRate: 0.6,
    channelFeeAmount: 5399,
    status: 20,
    userIp: '192.168.1.100',
    expireTime: '2024-03-01 23:59:59',
    successTime: '2024-03-01 10:30:15',
    notifyTime: '2024-03-01 10:30:20',
    refundStatus: 0,
    refundTimes: 0,
    refundAmount: 0,
    channelUserId: '2088001',
    channelOrderNo: '2024030122001',
    createTime: '2024-03-01 10:28:00',
  },
  {
    id: 2,
    merchantId: 1,
    appId: 1,
    channelId: 2,
    channelCode: 'wxpay',
    merchantOrderId: 'ORD20240302001',
    subject: '商品订单-耳机',
    body: 'AirPods Pro 2',
    notifyUrl: '',
    notifyStatus: 20,
    amount: 179900,
    channelFeeRate: 0.6,
    channelFeeAmount: 1079,
    status: 20,
    userIp: '192.168.1.101',
    expireTime: '2024-03-02 23:59:59',
    successTime: '2024-03-02 15:20:30',
    notifyTime: '2024-03-02 15:20:35',
    refundStatus: 10,
    refundTimes: 1,
    refundAmount: 179900,
    channelUserId: 'oXyz123',
    channelOrderNo: '420001234567890',
    createTime: '2024-03-02 15:18:00',
  },
  {
    id: 3,
    merchantId: 1,
    appId: 1,
    channelId: 1,
    channelCode: 'alipay',
    merchantOrderId: 'ORD20240303001',
    subject: '会员充值',
    body: '月度会员',
    notifyUrl: '',
    notifyStatus: 10,
    amount: 2999,
    channelFeeRate: 0.6,
    channelFeeAmount: 18,
    status: 10,
    userIp: '192.168.1.102',
    expireTime: '2024-03-03 23:59:59',
    successTime: '',
    notifyTime: '',
    refundStatus: 0,
    refundTimes: 0,
    refundAmount: 0,
    channelUserId: '',
    channelOrderNo: '',
    createTime: '2024-03-03 09:00:00',
  },
]

// --- Pay Refund ---
const refunds = [
  {
    id: 1,
    merchantId: 1,
    appId: 1,
    channelId: 2,
    channelCode: 'wxpay',
    orderId: '2',
    tradeNo: '420001234567890',
    merchantOrderId: 'ORD20240302001',
    merchantRefundNo: 'REF20240305001',
    notifyUrl: '',
    notifyStatus: 20,
    status: 20,
    type: 1,
    payAmount: 179900,
    refundAmount: 179900,
    reason: '用户申请退款',
    userIp: '192.168.1.101',
    channelOrderNo: '420001234567890',
    channelRefundNo: '500001234567890',
    channelErrorCode: '',
    channelErrorMsg: '',
    expireTime: '2024-03-05 23:59:59',
    successTime: '2024-03-05 16:00:10',
    notifyTime: '2024-03-05 16:00:15',
    createTime: '2024-03-05 15:30:00',
  },
]

// --- Pay Notify ---
const notifies = [
  {
    id: 1,
    channelId: 1,
    channelCode: 'alipay',
    orderId: '1',
    merchantOrderId: 'ORD20240301001',
    notifyType: 1,
    status: 20,
    times: 1,
    lastExecuteTime: '2024-03-01 10:30:20',
    nextRetryTime: '',
    createTime: '2024-03-01 10:30:15',
  },
  {
    id: 2,
    channelId: 2,
    channelCode: 'wxpay',
    orderId: '2',
    merchantOrderId: 'ORD20240302001',
    notifyType: 1,
    status: 20,
    times: 1,
    lastExecuteTime: '2024-03-02 15:20:35',
    nextRetryTime: '',
    createTime: '2024-03-02 15:20:30',
  },
  {
    id: 3,
    channelId: 2,
    channelCode: 'wxpay',
    orderId: '2',
    merchantOrderId: 'ORD20240302001',
    notifyType: 2,
    status: 20,
    times: 1,
    lastExecuteTime: '2024-03-05 16:00:15',
    nextRetryTime: '',
    createTime: '2024-03-05 16:00:10',
  },
]

// --- Wallet ---
const walletBalances = [
  {
    id: 1,
    userId: 1,
    userType: 1,
    totalBalance: 50000,
    freezeBalance: 0,
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    userId: 2,
    userType: 1,
    totalBalance: 12000,
    freezeBalance: 2000,
    createTime: '2024-01-15 10:00:00',
  },
]

const rechargePackages = [
  {
    id: 1,
    name: '充值100送10',
    payPrice: 10000,
    bonusPrice: 1000,
    status: 0,
    sort: 1,
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '充值200送30',
    payPrice: 20000,
    bonusPrice: 3000,
    status: 0,
    sort: 2,
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 3,
    name: '充值500送100',
    payPrice: 50000,
    bonusPrice: 10000,
    status: 0,
    sort: 3,
    createTime: '2024-01-01 00:00:00',
  },
]

const walletTransactions = [
  {
    id: 1,
    userId: 1,
    userType: 1,
    bizType: 1,
    bizId: 'RCH001',
    title: '钱包充值',
    price: 10000,
    balance: 50000,
    totalBalance: 50000,
    createTime: '2024-02-01 10:00:00',
  },
  {
    id: 2,
    userId: 1,
    userType: 1,
    bizType: 2,
    bizId: 'PAY001',
    title: '商品消费',
    price: -5000,
    balance: 45000,
    totalBalance: 45000,
    createTime: '2024-02-15 14:00:00',
  },
]

// --- Transfers ---
const transfers = [
  {
    id: 1,
    merchantId: 1,
    appId: 1,
    channelId: 1,
    channelCode: 'alipay',
    merchantTransferId: 'TRF20240310001',
    type: 1,
    amount: 50000,
    title: '商户提现',
    notifyUrl: '',
    status: 20,
    successTime: '2024-03-10 12:00:10',
    channelTransferNo: '2024031000001',
    channelErrorCode: '',
    channelErrorMsg: '',
    createTime: '2024-03-10 11:50:00',
  },
]

function filterPage<T extends Record<string, unknown>>(list: T[], params: Record<string, string>) {
  const pageNo = Number(params.pageNo) || 1
  const pageSize = Number(params.pageSize) || 10
  let filtered = [...list]
  if (params.name) filtered = filtered.filter((i) => String(i.name || '').includes(params.name))
  if (params.status !== undefined && params.status !== '')
    filtered = filtered.filter((i) => String(i.status) === params.status)
  if (params.subject)
    filtered = filtered.filter((i) => String(i.subject || '').includes(params.subject))
  const total = filtered.length
  const start = (pageNo - 1) * pageSize
  return paginate(filtered.slice(start, start + pageSize), total, pageNo, pageSize)
}

const ERR_NOT_FOUND = 'NOT_FOUND'

export const payAppHandlers = [
  // Pay App
  http.get('*/pay/app/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(filterPage(apps as unknown as Record<string, unknown>[], params))
  }),
  http.get('*/pay/app/get', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const app = apps.find((a) => a.id === id)
    return app
      ? HttpResponse.json(success(app))
      : HttpResponse.json(fail(ERR_NOT_FOUND, '应用不存在'))
  }),
  http.post('*/pay/app/create', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const app = {
      id: nextAppId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    apps.push(app as Record<string, unknown>)
    return HttpResponse.json(success(null))
  }),
  http.put('*/pay/app/update', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = apps.findIndex((a) => a.id === body.id)
    if (idx >= 0) Object.assign(apps[idx], body)
    return HttpResponse.json(success(null))
  }),
  http.delete('*/pay/app/delete', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const idx = apps.findIndex((a) => a.id === id)
    if (idx >= 0) apps.splice(idx, 1)
    return HttpResponse.json(success(null))
  }),
  http.put('*/pay/app/update-status', async ({ request }) => {
    const body = (await request.json()) as { id: number; status: number }
    const app = apps.find((a) => a.id === body.id)
    if (app) app.status = body.status
    return HttpResponse.json(success(null))
  }),
  http.get('*/pay/app/list', () => HttpResponse.json(success(apps))),

  // Pay Channel
  http.get('*/pay/channel/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(filterPage(channels as unknown as Record<string, unknown>[], params))
  }),
  http.post('*/pay/channel/create', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    channels.push({
      ...body,
      id: channels.length + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    } as Record<string, unknown>)
    return HttpResponse.json(success(null))
  }),
  http.put('*/pay/channel/update', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = channels.findIndex((c) => c.id === body.id)
    if (idx >= 0) Object.assign(channels[idx], body)
    return HttpResponse.json(success(null))
  }),
  http.delete('*/pay/channel/delete', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const idx = channels.findIndex((c) => c.id === id)
    if (idx >= 0) channels.splice(idx, 1)
    return HttpResponse.json(success(null))
  }),

  // Pay Order
  http.get('*/pay/order/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(filterPage(orders as unknown as Record<string, unknown>[], params))
  }),
  http.get('*/pay/order/get', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const order = orders.find((o) => o.id === id)
    return order
      ? HttpResponse.json(success(order))
      : HttpResponse.json(fail(ERR_NOT_FOUND, '订单不存在'))
  }),
  http.get('*/pay/order/get-detail', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const order = orders.find((o) => o.id === id)
    return order
      ? HttpResponse.json(success(order))
      : HttpResponse.json(fail(ERR_NOT_FOUND, '订单不存在'))
  }),

  // Pay Refund
  http.get('*/pay/refund/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(filterPage(refunds as unknown as Record<string, unknown>[], params))
  }),
  http.get('*/pay/refund/get', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const refund = refunds.find((r) => r.id === id)
    return refund
      ? HttpResponse.json(success(refund))
      : HttpResponse.json(fail(ERR_NOT_FOUND, '退款不存在'))
  }),
  http.post('*/pay/refund/create', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    refunds.push({
      ...body,
      id: refunds.length + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    } as Record<string, unknown>)
    return HttpResponse.json(success(null))
  }),
  http.put('*/pay/refund/update', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = refunds.findIndex((r) => r.id === body.id)
    if (idx >= 0) Object.assign(refunds[idx], body)
    return HttpResponse.json(success(null))
  }),
  http.delete('*/pay/refund/delete', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const idx = refunds.findIndex((r) => r.id === id)
    if (idx >= 0) refunds.splice(idx, 1)
    return HttpResponse.json(success(null))
  }),

  // Pay Notify
  http.get('*/pay/notify/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(filterPage(notifies as unknown as Record<string, unknown>[], params))
  }),

  // Wallet Balance
  http.get('*/pay/wallet/balance/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(
      filterPage(walletBalances as unknown as Record<string, unknown>[], params),
    )
  }),

  // Wallet Recharge Package
  http.get('*/pay/wallet/recharge-package/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(
      filterPage(rechargePackages as unknown as Record<string, unknown>[], params),
    )
  }),
  http.post('*/pay/wallet/recharge-package/create', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    rechargePackages.push({
      ...body,
      id: rechargePackages.length + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    } as Record<string, unknown>)
    return HttpResponse.json(success(null))
  }),
  http.put('*/pay/wallet/recharge-package/update', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = rechargePackages.findIndex((p) => p.id === body.id)
    if (idx >= 0) Object.assign(rechargePackages[idx], body)
    return HttpResponse.json(success(null))
  }),
  http.delete('*/pay/wallet/recharge-package/delete', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const idx = rechargePackages.findIndex((p) => p.id === id)
    if (idx >= 0) rechargePackages.splice(idx, 1)
    return HttpResponse.json(success(null))
  }),

  // Wallet Transaction
  http.get('*/pay/wallet/transaction/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(
      filterPage(walletTransactions as unknown as Record<string, unknown>[], params),
    )
  }),

  // Transfer
  http.get('*/pay/transfer/page', ({ request }) => {
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams) as Record<string, string>
    return HttpResponse.json(filterPage(transfers as unknown as Record<string, unknown>[], params))
  }),
  http.get('*/pay/transfer/get', ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const transfer = transfers.find((t) => t.id === id)
    return transfer
      ? HttpResponse.json(success(transfer))
      : HttpResponse.json(fail(ERR_NOT_FOUND, '转账不存在'))
  }),
  http.post('*/pay/transfer/create', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    transfers.push({
      ...body,
      id: transfers.length + 1,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    } as Record<string, unknown>)
    return HttpResponse.json(success(null))
  }),
]

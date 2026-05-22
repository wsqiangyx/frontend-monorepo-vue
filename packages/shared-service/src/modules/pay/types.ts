// Pay module types

export interface AppVO {
  id: number
  appKey: string
  name: string
  status: number
  remark: string
  payNotifyUrl: string
  refundNotifyUrl: string
  transferNotifyUrl: string
  merchantId: number
  merchantName: string
  createTime: string
}

export interface ChannelVO {
  id: number
  code: string
  config: string
  status: number
  remark: string
  feeRate: number
  appId: number
  createTime: string
}

export interface OrderVO {
  id: number
  merchantId: number
  appId: number
  channelId: number
  channelCode: string
  merchantOrderId: string
  subject: string
  body: string
  notifyUrl: string
  notifyStatus: number
  amount: number
  channelFeeRate: number
  channelFeeAmount: number
  status: number
  userIp: string
  expireTime: string
  successTime: string
  notifyTime: string
  refundStatus: number
  refundTimes: number
  refundAmount: number
  channelUserId: string
  channelOrderNo: string
  createTime: string
}

export interface RefundVO {
  id: number
  merchantId: number
  appId: number
  channelId: number
  channelCode: string
  orderId: string
  tradeNo: string
  merchantOrderId: string
  merchantRefundNo: string
  notifyUrl: string
  notifyStatus: number
  status: number
  type: number
  payAmount: number
  refundAmount: number
  reason: string
  userIp: string
  channelOrderNo: string
  channelRefundNo: string
  channelErrorCode: string
  channelErrorMsg: string
  expireTime: string
  successTime: string
  notifyTime: string
  createTime: string
}

export interface NotifyVO {
  id: number
  channelId: number
  channelCode: string
  orderId: string
  merchantOrderId: string
  notifyType: number
  status: number
  times: number
  lastExecuteTime: string
  nextRetryTime: string
  createTime: string
}

export interface WalletBalanceVO {
  id: number
  userId: number
  userType: number
  totalBalance: number
  freezeBalance: number
  createTime: string
}

export interface WalletRechargePackageVO {
  id: number
  name: string
  payPrice: number
  bonusPrice: number
  status: number
  sort: number
  createTime: string
}

export interface WalletTransactionVO {
  id: number
  userId: number
  userType: number
  bizType: number
  bizId: string
  title: string
  price: number
  balance: number
  totalBalance: number
  createTime: string
}

export interface TransferVO {
  id: number
  merchantId: number
  appId: number
  channelId: number
  channelCode: string
  merchantTransferId: string
  type: number
  amount: number
  title: string
  notifyUrl: string
  status: number
  successTime: string
  channelTransferNo: string
  channelErrorCode: string
  channelErrorMsg: string
  createTime: string
}

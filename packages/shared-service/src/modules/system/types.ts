// ============================================================================
// 系统管理模块类型定义
// ============================================================================

export interface UserVO {
  id: number
  username: string
  nickname: string
  deptId: number
  deptName?: string
  postIds: number[]
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  status: number
  remark: string
  loginDate: string
  createTime: string
  roles?: string[]
}

export interface UserQuery {
  pageNo: number
  pageSize: number
  username?: string
  mobile?: string
  status?: number
  deptId?: number
  createTime?: string[]
}

export interface UserForm {
  id?: number
  username: string
  nickname: string
  deptId?: number
  mobile?: string
  email?: string
  sex?: number
  postIds?: number[]
  remark?: string
  status?: number
  password?: string
  roleIds?: number[]
}

export interface RoleVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  type: number
  remark: string
  createTime: string
  menuIds?: number[]
  dataScope?: number
}

export interface RoleQuery {
  pageNo: number
  pageSize: number
  name?: string
  code?: string
  status?: number
}

export interface MenuVO {
  id: number
  name: string
  parentId: number
  type: number
  sort: number
  path?: string
  icon?: string
  component?: string
  permission?: string
  status: number
  children?: MenuVO[]
  createTime: string
}

export interface DeptVO {
  id: number
  name: string
  parentId: number
  sort: number
  leaderUserId?: number
  phone?: string
  email?: string
  status: number
  children?: DeptVO[]
  createTime: string
}

export interface PostVO {
  id: number
  code: string
  name: string
  sort: number
  status: number
  remark: string
  createTime: string
}

export interface DictTypeVO {
  id: number
  name: string
  type: string
  status: number
  remark: string
  createTime: string
}

export interface DictDataVO {
  id: number
  sort: number
  label: string
  value: string
  dictType: string
  status: number
  remark: string
  createTime: string
}

export interface NoticeVO {
  id: number
  title: string
  type: number
  content: string
  status: number
  remark: string
  createTime: string
}

export interface ErrorCodeVO {
  id: number
  type: number
  applicationName: string
  code: number
  message: string
  memo: string
  status: number
  createTime: string
}

export interface TenantVO {
  id: number
  name: string
  contactName: string
  contactMobile: string
  packageId: number
  packageName?: string
  accountNumber: number
  expireTime: string
  status: number
  remark: string
  createTime: string
}

export interface TenantPackageVO {
  id: number
  name: string
  status: number
  remark: string
  menuIds: number[]
  createTime: string
}

export interface SmsChannelVO {
  id: number
  signature: string
  code: string
  name: string
  status: number
  remark: string
  createTime: string
}

export interface SmsTemplateVO {
  id: number
  type: number
  code: string
  name: string
  content: string
  params: string[]
  status: number
  remark: string
  channelId: number
  channelCode: string
  createTime: string
}

export interface SmsLogVO {
  id: number
  channelId: number
  channelCode: string
  templateId: number
  templateCode: string
  templateType: number
  mobile: string
  content: string
  params: Record<string, string>
  sendStatus: number
  sendTime: string
  receiveStatus: number
  receiveTime: string
  createTime: string
}

export interface MailAccountVO {
  id: number
  mail: string
  host: string
  port: number
  sslEnabled: boolean
  username: string
  password: string
  fromName: string
  status: number
  remark: string
  createTime: string
}

export interface MailTemplateVO {
  id: number
  name: number
  accountId: number
  nickname: string
  title: string
  content: string
  params: string[]
  status: number
  remark: string
  createTime: string
}

export interface MailLogVO {
  id: number
  accountId: number
  templateId: number
  templateCode: string
  mail: string
  subject: string
  content: string
  sendStatus: number
  sendTime: string
  sendMessageId: string
  createTime: string
}

export interface OperateLogVO {
  id: number
  userId: number
  userType: number
  userName: string
  bizType: number
  bizId: number
  action: string
  method: string
  httpMethod: string
  url: string
  bizData: string
  resultCode: number
  resultMsg: string
  userIp: string
  userAgent: string
  duration: number
  createTime: string
}

export interface LoginLogVO {
  id: number
  userId: number
  userType: number
  username: string
  userIp: string
  userAgent: string
  loginType: number
  resultCode: number
  resultMsg: string
  loginDate: string
  createTime: string
}

export interface OAuth2ClientVO {
  id: number
  clientId: string
  clientKey: string
  clientSecret: string
  name: string
  logo: string
  description: string
  status: number
  accessTokenValiditySeconds: number
  refreshTokenValiditySeconds: number
  redirectUris: string[]
  autoApproveScopes: string[]
  authorizedGrantTypes: string[]
  scopes: string[]
  authorities: string[]
  resourceIds: string[]
  additionalInformation: string
  createTime: string
}

export interface OnlineUserVO {
  id: number
  userId: number
  userType: number
  username: string
  userIp: string
  userAgent: string
  loginTime: string
}

export interface PageResult<T> {
  list: T[]
  total: number
}

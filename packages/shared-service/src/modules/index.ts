// ============================================================================
// API 模块聚合导出
// ============================================================================
export { createAuthApi } from './auth'
export type { LoginParams, LoginResult, UserInfo, SmsLoginParams, RegisterParams } from './auth'

export { createUserApi } from './system/user'
export { createRoleApi } from './system/role'
export { createMenuApi } from './system/menu'
export { createDeptApi } from './system/dept'
export { createPostApi } from './system/post'
export { createDictTypeApi, createDictDataApi } from './system/dict'
export { createNoticeApi } from './system/notice'
export { createErrorCodeApi } from './system/errorCode'
export { createTenantApi } from './system/tenant'
export { createTenantPackageApi } from './system/tenantPackage'
export { createSmsChannelApi, createSmsTemplateApi, createSmsLogApi } from './system/sms'
export { createMailAccountApi, createMailTemplateApi, createMailLogApi } from './system/mail'
export { createOperateLogApi } from './system/operateLog'
export { createLoginLogApi } from './system/loginLog'
export { createOAuth2ClientApi } from './system/oauth2'
export { createOnlineUserApi } from './system/onlineUser'

export type {
  UserVO,
  UserQuery,
  UserForm,
  RoleVO,
  RoleQuery,
  MenuVO,
  DeptVO,
  PostVO,
  DictTypeVO,
  DictDataVO,
  NoticeVO,
  ErrorCodeVO,
  TenantVO,
  TenantPackageVO,
  SmsChannelVO,
  SmsTemplateVO,
  SmsLogVO,
  MailAccountVO,
  MailTemplateVO,
  MailLogVO,
  OperateLogVO,
  LoginLogVO,
  OAuth2ClientVO,
  OnlineUserVO,
  PageResult,
} from './system/types'

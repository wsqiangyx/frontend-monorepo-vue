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

export { createCodegenApi, createDataSourceConfigApi } from './infra/codegen'
export { createFileApi } from './infra/file'
export { createFileConfigApi } from './infra/fileConfig'
export { createJobApi, createJobLogApi } from './infra/job'
export { createConfigApi } from './infra/config'
export { createRedisApi } from './infra/redis'
export { createApiAccessLogApi } from './infra/apiAccessLog'
export { createApiErrorLogApi } from './infra/apiErrorLog'

export type {
  CodegenTableVO,
  CodegenColumnVO,
  DatabaseTableVO,
  CodegenPreviewVO,
  CodegenUpdateReqVO,
  DataSourceConfigVO,
  FileVO,
  FileConfigVO,
  JobVO,
  JobLogVO,
  ConfigVO,
  RedisInfoVO,
  RedisMonitorInfoVO,
  RedisKeyVO,
  ApiAccessLogVO,
  ApiErrorLogVO,
} from './infra/types'

export { createModelApi } from './bpm/model'
export { createDefinitionApi } from './bpm/definition'
export { createTaskApi } from './bpm/task'
export { createFormApi } from './bpm/form'
export { createCategoryApi } from './bpm/category'
export { createProcessInstanceApi } from './bpm/processInstance'
export { createUserGroupApi } from './bpm/userGroup'
export { createProcessListenerApi } from './bpm/processListener'
export { createProcessExpressionApi } from './bpm/processExpression'

export type {
  ModelVO,
  ProcessDefinitionVO,
  DefinitionVO,
  FormVO,
  ProcessInstanceVO,
  TaskVO,
  CategoryVO,
  UserGroupVO,
  ProcessListenerVO,
  ProcessExpressionVO,
} from './bpm/types'

export { createPayAppApi } from './pay/app'
export { createPayChannelApi } from './pay/channel'
export { createPayOrderApi } from './pay/order'
export { createPayRefundApi } from './pay/refund'
export { createPayNotifyApi } from './pay/notify'
export {
  createWalletBalanceApi,
  createWalletRechargePackageApi,
  createWalletTransactionApi,
} from './pay/wallet'
export { createPayTransferApi } from './pay/transfer'

export type {
  AppVO as PayAppVO,
  ChannelVO as PayChannelVO,
  OrderVO as PayOrderVO,
  RefundVO as PayRefundVO,
  NotifyVO as PayNotifyVO,
  WalletBalanceVO,
  WalletRechargePackageVO,
  WalletTransactionVO,
  TransferVO as PayTransferVO,
} from './pay/types'

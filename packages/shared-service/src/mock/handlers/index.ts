import { authHandlers } from './auth'
import { chartHandlers } from './chart'
import { dashboardHandlers } from './dashboard'
import { dictionaryHandlers } from './dictionary'
import { navigationHandlers } from './navigation'
import { roleHandlers } from './role'
import { routeHandlers } from './route'
import { screenHandlers } from './screen'
import { shareHandlers } from './share'
import { systemMetaHandlers } from './system-meta'
import { userHandlers } from './user'
import { systemUserHandlers } from './system-user'
import { systemRoleHandlers } from './system-role'
import { systemMenuHandlers } from './system-menu'
import { systemDeptHandlers } from './system-dept'
import { systemPostHandlers } from './system-post'
import { systemDictHandlers } from './system-dict'
import { systemNoticeHandlers } from './system-notice'
import { systemErrorCodeHandlers } from './system-error-code'
import { systemTenantHandlers } from './system-tenant'
import { systemSmsHandlers } from './system-sms'
import { systemMailHandlers } from './system-mail'
import { systemOperateLogHandlers } from './system-operate-log'
import { systemLoginLogHandlers } from './system-login-log'
import { systemOAuth2Handlers } from './system-oauth2'
import { infraCodegenHandlers } from './infra-codegen'
import { infraFileHandlers, infraFileConfigHandlers } from './infra-file'
import { infraJobHandlers } from './infra-job'
import { infraConfigHandlers } from './infra-config'
import { infraRedisHandlers } from './infra-redis'
import { infraApiAccessLogHandlers } from './infra-api-access-log'
import { infraApiErrorLogHandlers } from './infra-api-error-log'
import { bpmHandlers } from './bpm-model'
import { payAppHandlers } from './pay-app'

export const handlers = [
  ...userHandlers,
  ...chartHandlers,
  ...authHandlers,
  ...navigationHandlers,
  ...dashboardHandlers,
  ...dictionaryHandlers,
  ...roleHandlers,
  ...systemMetaHandlers,
  ...screenHandlers,
  ...routeHandlers,
  ...shareHandlers,
  ...systemUserHandlers,
  ...systemRoleHandlers,
  ...systemMenuHandlers,
  ...systemDeptHandlers,
  ...systemPostHandlers,
  ...systemDictHandlers,
  ...systemNoticeHandlers,
  ...systemErrorCodeHandlers,
  ...systemTenantHandlers,
  ...systemSmsHandlers,
  ...systemMailHandlers,
  ...systemOperateLogHandlers,
  ...systemLoginLogHandlers,
  ...systemOAuth2Handlers,
  ...infraCodegenHandlers,
  ...infraFileHandlers,
  ...infraFileConfigHandlers,
  ...infraJobHandlers,
  ...infraConfigHandlers,
  ...infraRedisHandlers,
  ...infraApiAccessLogHandlers,
  ...infraApiErrorLogHandlers,
  ...bpmHandlers,
  ...payAppHandlers,
]

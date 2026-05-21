// ============================================================================
// 认证 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { LoginParams, LoginResult, UserInfo, SmsLoginParams, RegisterParams } from './types'

export type { LoginParams, LoginResult, UserInfo, SmsLoginParams, RegisterParams }

export function createAuthApi(http: AxiosInstance) {
  return {
    /** 账号密码登录 */
    login(data: LoginParams) {
      return http.post<LoginResult>('/system/auth/login', data)
    },

    /** 登出 */
    logout() {
      return http.post('/system/auth/logout')
    },

    /** 获取当前用户信息（含权限、角色、菜单） */
    getUserInfo() {
      return http.get<UserInfo>('/system/auth/get-permission-info')
    },

    /** 短信登录 */
    smsLogin(data: SmsLoginParams) {
      return http.post<LoginResult>('/system/auth/sms-login', data)
    },

    /** 注册 */
    register(data: RegisterParams) {
      return http.post('/system/auth/register', data)
    },

    /** 发送短信验证码 */
    sendSmsCode(data: { mobile: string }) {
      return http.post('/system/auth/send-sms-code', data)
    },

    /** 刷新令牌 */
    refreshToken(refreshToken: string) {
      return http.post<LoginResult>('/system/auth/refresh-token', null, {
        params: { refreshToken },
      })
    },
  }
}

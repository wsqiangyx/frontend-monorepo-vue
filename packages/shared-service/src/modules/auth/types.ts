// ============================================================================
// 认证相关类型定义
// ============================================================================

export interface LoginParams {
  username: string
  password: string
  captchaVerification?: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  expiresTime?: number
  userId?: number
  userType?: number
  clientId?: string
}

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  deptId?: number
  deptName?: string
  roles: string[]
  permissions: string[]
}

export interface SmsLoginParams {
  mobile: string
  code: string
}

export interface RegisterParams {
  username: string
  password: string
  captchaVerification?: string
}

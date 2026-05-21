// ============================================================================
// Token 管理 — 平台无关的 localStorage 存取
// ============================================================================

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN'

export interface TokenType {
  accessToken: string
  refreshToken: string
  expiresTime?: number
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setToken(token: TokenType): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken)
}

export function removeToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

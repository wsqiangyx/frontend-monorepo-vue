// ============================================================================
// @repo/shared-service — 请求模块
// ============================================================================
export type {
  ApiResponse as PlatformApiResponse,
  PaginatedData as PlatformPageResult,
  PlatformError,
} from '../types'

export { createPlatformError, isSuccessResponse, createPageResult } from '../types'

export { createHttpClient, setRequestCallbacks } from './http'
export type { RequestCallbacks } from './http'
export { getAccessToken, getRefreshToken, setToken, removeToken } from './token'
export type { TokenType } from './token'

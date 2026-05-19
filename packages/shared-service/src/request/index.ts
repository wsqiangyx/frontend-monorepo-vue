// ============================================================================
// @repo/shared-service — 请求/响应契约
// ============================================================================
// 类型从本包统一导出，本模块提供向后兼容别名。
// ============================================================================
export type {
  ApiResponse as PlatformApiResponse,
  PaginatedData as PlatformPageResult,
  PlatformError,
} from '../types'

export { createPlatformError, isSuccessResponse, createPageResult } from '../types'

// ============================================================================
// @repo/shared-service — 平台共享类型定义
// ============================================================================
// 共享类型保持与框架无关，避免 app 在类型层产生额外耦合。
// mock handler 返回值也遵循 ApiResponse<T>，确保前后端契约一致。
// ============================================================================

/**
 * 标准 API 响应包装。平台接口统一返回此格式。
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  code: string
  data: T
  message: string
  requestId?: string
  timestamp: string
}

/**
 * 分页查询参数。与后端分页接口的请求参数对应。
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/**
 * 分页数据响应。后端分页接口的 data 字段使用此类型。
 */
export interface PaginatedData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 平台业务错误。适用于非网络层面的业务逻辑错误。
 */
export interface PlatformError {
  code: string
  message: string
  details?: unknown
}

export function createPlatformError(
  code: string,
  message: string,
  details?: unknown,
): PlatformError {
  return { code, message, details }
}

export function isSuccessResponse<T>(response: ApiResponse<T>): boolean {
  return response.success
}

export function createPageResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedData<T> {
  return { items, total, page, pageSize }
}

// ============================================================================
// @repo/shared-utils -- HttpClient Interface & Types
// ============================================================================
// Port/Adapter 模式：shared-service 仅消费此接口，不直接依赖具体 HTTP 库。
// ky-adapter.ts 提供 ky 实现，upload.ts 提供 XHR 上传实现。
// ============================================================================

/** 通用请求配置 */
export interface RequestConfig {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
  signal?: AbortSignal
}

/** HTTP 客户端接口抽象 */
export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  delete<T>(url: string, config?: RequestConfig): Promise<T>
}

/** 上传进度信息 */
export interface UploadProgress {
  loaded: number
  total: number
  percent: number
}

export type UploadProgressCallback = (progress: UploadProgress) => void

/** 上传专用配置 */
export interface UploadConfig extends RequestConfig {
  onProgress?: UploadProgressCallback
  /** 表单字段名，默认 "file" */
  fieldName?: string
}

/** HTTP 方法枚举 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

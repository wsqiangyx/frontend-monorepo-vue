// ============================================================================
// @repo/shared-utils -- HttpClient ky Adapter Implementation
// ============================================================================
// 基于 ky 库实现 HttpClient 接口。
// ky 基于 Fetch API，零依赖，体积小（~3KB gzipped）。
// ============================================================================
import ky, { type Options } from 'ky'
import type { HttpClient, RequestConfig } from './types'

/** 默认超时时间（毫秒） */
const DEFAULT_TIMEOUT = 15000

/**
 * 将项目通用的 RequestConfig 转换为 ky Options
 */
function toKyOptions(config?: RequestConfig): Options {
  const options: Options = {}

  if (config?.timeout) {
    options.timeout = config.timeout
  } else {
    options.timeout = DEFAULT_TIMEOUT
  }

  if (config?.headers) {
    options.headers = config.headers
  }

  if (config?.signal) {
    options.signal = config.signal
  }

  if (config?.baseURL) {
    options.prefixUrl = config.baseURL
  }

  return options
}

/**
 * 创建基于 ky 的 HttpClient 实例
 *
 * @param defaultConfig - 全局默认请求配置
 * @returns HttpClient 实例
 */
export function createKyHttpClient(defaultConfig?: RequestConfig): HttpClient {
  const baseOptions = toKyOptions(defaultConfig)

  const client: HttpClient = {
    async get<T>(url: string, config?: RequestConfig): Promise<T> {
      const response = await ky.get(url, { ...baseOptions, ...toKyOptions(config) })
      return response.json<T>()
    },

    async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
      const options: Options = {
        ...baseOptions,
        ...toKyOptions(config),
        json: data,
      }
      const response = await ky.post(url, options)
      return response.json<T>()
    },

    async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
      const options: Options = {
        ...baseOptions,
        ...toKyOptions(config),
        json: data,
      }
      const response = await ky.put(url, options)
      return response.json<T>()
    },

    async delete<T>(url: string, config?: RequestConfig): Promise<T> {
      const response = await ky.delete(url, { ...baseOptions, ...toKyOptions(config) })
      return response.json<T>()
    },
  }

  return client
}

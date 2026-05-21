// ============================================================================
// Axios 实例 — 带 Token 注入、响应拦截、Token 刷新
// ============================================================================
// 共享层不直接依赖 Vue/DOM，消息提示通过回调注入。
// ============================================================================

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, setToken } from './token'

/** 错误回调注入 — 由应用层注册 */
export interface RequestCallbacks {
  /** 业务错误提示（如 MessagePlugin.error） */
  onErrorMessage?: (message: string) => void
  /** 401 授权失效回调（如跳转登录页） */
  onUnauthorized?: () => void
}

let callbacks: RequestCallbacks = {}

export function setRequestCallbacks(cb: RequestCallbacks): void {
  callbacks = { ...callbacks, ...cb }
}

// Token 刷新状态
let isRefreshing = false
let requestQueue: Array<(token: string) => void> = []

function processQueue(newToken: string): void {
  requestQueue.forEach((cb) => cb(newToken))
  requestQueue = []
}

const TOKEN_WHITELIST = ['/auth/login', '/auth/refresh-token']

function isTokenWhitelisted(url: string): boolean {
  return TOKEN_WHITELIST.some((path) => url.includes(path))
}

export function createHttpClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 30_000,
    withCredentials: false,
  })

  // ---------- 请求拦截器 ----------
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token && !isTokenWhitelisted(config.url ?? '')) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // ---------- 响应拦截器 ----------
  instance.interceptors.response.use(
    (response) => {
      const { data } = response

      // 二进制响应直接返回
      if (
        response.config.responseType === 'blob' ||
        response.config.responseType === 'arraybuffer'
      ) {
        return data
      }

      // 芋道格式: { code: 0, data, msg }
      if (data && typeof data.code !== 'undefined') {
        if (data.code === 0 || data.code === 200) {
          return data
        }

        // 401: Token 过期
        if (data.code === 401) {
          return handleTokenRefresh(response.config)
        }

        // 业务错误
        const msg = data.msg || data.message || '请求失败'
        callbacks.onErrorMessage?.(msg)
        return Promise.reject(new Error(msg))
      }

      // 本平台格式: { success, code, data, message }
      if (data && typeof data.success !== 'undefined') {
        if (data.success) {
          return data
        }
        const msg = data.message || '请求失败'
        callbacks.onErrorMessage?.(msg)
        return Promise.reject(new Error(msg))
      }

      return data
    },
    (error) => {
      if (error.response?.status === 401) {
        return handleTokenRefresh(error.config)
      }

      const msg =
        error.response?.data?.msg || error.response?.data?.message || error.message || '网络异常'
      callbacks.onErrorMessage?.(msg)
      return Promise.reject(error)
    },
  )

  return instance
}

async function handleTokenRefresh(failedConfig: AxiosRequestConfig): Promise<unknown> {
  if (!isRefreshing) {
    isRefreshing = true
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      isRefreshing = false
      callbacks.onUnauthorized?.()
      return Promise.reject(new Error('无刷新令牌'))
    }

    try {
      const { data } = await axios.post(`${failedConfig.baseURL ?? ''}/auth/refresh-token`, null, {
        params: { refreshToken },
      })

      const newToken = data?.data ?? data
      if (newToken?.accessToken) {
        setToken(newToken)
        processQueue(newToken.accessToken)

        // 重试原请求
        failedConfig.headers = failedConfig.headers ?? {}
        failedConfig.headers.Authorization = `Bearer ${newToken.accessToken}`
        return axios(failedConfig)
      }

      // 刷新失败
      processQueue('')
      callbacks.onUnauthorized?.()
      return Promise.reject(new Error('刷新令牌失败'))
    } catch {
      processQueue('')
      callbacks.onUnauthorized?.()
      return Promise.reject(new Error('刷新令牌失败'))
    } finally {
      isRefreshing = false
      requestQueue = []
    }
  }

  // 等待刷新完成
  return new Promise((resolve) => {
    requestQueue.push((newToken: string) => {
      if (newToken && failedConfig.headers) {
        failedConfig.headers.Authorization = `Bearer ${newToken}`
      }
      resolve(axios(failedConfig!))
    })
  })
}

// ============================================================================
// @repo/shared-utils -- XHR Upload with Progress
// ============================================================================
// ky 基于 fetch API，不支持上传进度回调。
// 本模块使用原生 XMLHttpRequest 封装文件上传，提供进度回调能力。
// ============================================================================
import type { UploadConfig, UploadProgress } from './types'

/**
 * 使用原生 XHR 的文件上传，支持进度回调。
 *
 * @param url - 上传目标 URL
 * @param file - 待上传的 File 或 Blob
 * @param config - 上传配置（含可选进度回调）
 * @returns 上传响应数据
 */
export function uploadWithProgress<T = unknown>(
  url: string,
  file: File | Blob,
  config?: UploadConfig,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const fieldName = config?.fieldName ?? 'file'

    // 进度事件
    if (config?.onProgress) {
      xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percent: Math.round((event.loaded / event.total) * 100),
          }
          config.onProgress!(progress)
        }
      })
    }

    // 完成事件
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as T
          resolve(data)
        } catch {
          resolve(xhr.responseText as unknown as T)
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    // 错误事件
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })

    // 超时
    if (config?.timeout) {
      xhr.timeout = config.timeout
    }
    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout'))
    })

    // 中止
    if (config?.signal) {
      config.signal.addEventListener('abort', () => xhr.abort())
    }

    xhr.open('POST', url, true)

    // 设置请求头
    if (config?.headers) {
      for (const [key, value] of Object.entries(config.headers)) {
        xhr.setRequestHeader(key, value)
      }
    }
    // 不设置 Content-Type，让浏览器自动生成 multipart/form-data boundary

    const formData = new FormData()
    formData.append(fieldName, file)

    xhr.send(formData)
  })
}

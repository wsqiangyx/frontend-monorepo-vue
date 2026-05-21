// ============================================================================
// 错误码管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { ErrorCodeVO, PageResult } from './types'

export function createErrorCodeApi(http: AxiosInstance) {
  return {
    /** 错误码分页列表 */
    getPage(params: {
      pageNo: number
      pageSize: number
      type?: number
      applicationName?: string
      code?: number
      message?: string
    }) {
      return http.get<PageResult<ErrorCodeVO>>('/system/error-code/page', { params })
    },

    /** 获取错误码详情 */
    get(id: number) {
      return http.get<ErrorCodeVO>('/system/error-code/get', { params: { id } })
    },

    /** 新增错误码 */
    create(data: Partial<ErrorCodeVO>) {
      return http.post('/system/error-code/create', data)
    },

    /** 修改错误码 */
    update(data: Partial<ErrorCodeVO>) {
      return http.put('/system/error-code/update', data)
    },

    /** 删除错误码 */
    delete(id: number) {
      return http.delete('/system/error-code/delete', { params: { id } })
    },
  }
}

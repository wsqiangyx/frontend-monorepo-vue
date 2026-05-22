// ============================================================================
// API 错误日志 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ApiErrorLogVO } from './types'

export function createApiErrorLogApi(http: AxiosInstance) {
  return {
    /** 错误日志分页 */
    getPage(params: {
      pageNo: number
      pageSize: number
      userId?: number
      userType?: number
      applicationName?: string
      processStatus?: number
      exceptionTime?: string[]
    }) {
      return http.get<{ data: { list: ApiErrorLogVO[]; total: number } }>(
        '/infra/api-error-log/page',
        { params },
      )
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: ApiErrorLogVO }>('/infra/api-error-log/get', { params: { id } })
    },
    /** 更新处理状态 */
    updateStatus(id: number, processStatus: number) {
      return http.put('/infra/api-error-log/update-status', null, { params: { id, processStatus } })
    },
    /** 导出 */
    exportList(params: Record<string, unknown>) {
      return http.get('/infra/api-error-log/export', { params, responseType: 'blob' })
    },
  }
}

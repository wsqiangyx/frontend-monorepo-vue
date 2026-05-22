// ============================================================================
// API 访问日志 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ApiAccessLogVO } from './types'

export function createApiAccessLogApi(http: AxiosInstance) {
  return {
    /** 访问日志分页 */
    getPage(params: {
      pageNo: number
      pageSize: number
      userId?: number
      userType?: number
      applicationName?: string
      requestUrl?: string
      duration?: number
      resultCode?: number
      beginTime?: string[]
    }) {
      return http.get<{ data: { list: ApiAccessLogVO[]; total: number } }>(
        '/infra/api-access-log/page',
        { params },
      )
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: ApiAccessLogVO }>('/infra/api-access-log/get', { params: { id } })
    },
    /** 导出 */
    exportList(params: Record<string, unknown>) {
      return http.get('/infra/api-access-log/export', { params, responseType: 'blob' })
    },
  }
}

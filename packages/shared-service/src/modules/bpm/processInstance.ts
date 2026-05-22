// ============================================================================
// 流程实例 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ProcessInstanceVO } from './types'

export function createProcessInstanceApi(http: AxiosInstance) {
  return {
    /** 流程实例分页 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<{ data: { list: ProcessInstanceVO[]; total: number } }>(
        '/bpm/process-instance/page',
        { params },
      )
    },
    /** 获取流程实例详情 */
    get(id: string) {
      return http.get<{ data: ProcessInstanceVO }>('/bpm/process-instance/get', { params: { id } })
    },
    /** 取消流程实例 */
    cancel(id: string) {
      return http.put('/bpm/process-instance/cancel', { id })
    },
  }
}

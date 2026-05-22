// ============================================================================
// 流程监听器 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ProcessListenerVO } from './types'

export function createProcessListenerApi(http: AxiosInstance) {
  return {
    /** 分页 */
    getPage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: ProcessListenerVO[]; total: number } }>(
        '/bpm/process-listener/page',
        { params },
      )
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: ProcessListenerVO }>('/bpm/process-listener/get', { params: { id } })
    },
    /** 创建 */
    create(data: Partial<ProcessListenerVO>) {
      return http.post('/bpm/process-listener/create', data)
    },
    /** 修改 */
    update(data: Partial<ProcessListenerVO>) {
      return http.put('/bpm/process-listener/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/bpm/process-listener/delete', { params: { id } })
    },
  }
}

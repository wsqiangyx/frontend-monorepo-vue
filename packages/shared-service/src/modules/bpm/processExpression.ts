// ============================================================================
// 流程表达式 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ProcessExpressionVO } from './types'

export function createProcessExpressionApi(http: AxiosInstance) {
  return {
    /** 分页 */
    getPage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: ProcessExpressionVO[]; total: number } }>(
        '/bpm/process-expression/page',
        { params },
      )
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: ProcessExpressionVO }>('/bpm/process-expression/get', {
        params: { id },
      })
    },
    /** 创建 */
    create(data: Partial<ProcessExpressionVO>) {
      return http.post('/bpm/process-expression/create', data)
    },
    /** 修改 */
    update(data: Partial<ProcessExpressionVO>) {
      return http.put('/bpm/process-expression/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/bpm/process-expression/delete', { params: { id } })
    },
  }
}

// ============================================================================
// 流程定义 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { DefinitionVO } from './types'

export function createDefinitionApi(http: AxiosInstance) {
  return {
    /** 获取流程定义列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; category?: string }) {
      return http.get<{ data: { list: DefinitionVO[]; total: number } }>('/bpm/definition/page', {
        params,
      })
    },
    /** 获取简单流程定义列表 */
    getSimpleList() {
      return http.get<{ data: Array<{ key: string; name: string }> }>('/bpm/definition/simple-list')
    },
    /** 修改流程定义状态 */
    updateState(id: string, state: number) {
      return http.put('/bpm/definition/update-state', { id, state })
    },
    /** 删除流程定义 */
    delete(id: string) {
      return http.delete('/bpm/definition/delete', { params: { id } })
    },
  }
}

// ============================================================================
// 流程表单 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { FormVO } from './types'

export function createFormApi(http: AxiosInstance) {
  return {
    /** 流程表单分页 */
    getPage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: FormVO[]; total: number } }>('/bpm/form/page', { params })
    },
    /** 获取全部表单简单列表 */
    getSimpleList() {
      return http.get<{ data: Array<{ id: number; name: string }> }>('/bpm/form/simple-list')
    },
    /** 获取表单详情 */
    get(id: number) {
      return http.get<{ data: FormVO }>('/bpm/form/get', { params: { id } })
    },
    /** 创建表单 */
    create(data: Partial<FormVO>) {
      return http.post('/bpm/form/create', data)
    },
    /** 修改表单 */
    update(data: Partial<FormVO>) {
      return http.put('/bpm/form/update', data)
    },
    /** 删除表单 */
    delete(id: number) {
      return http.delete('/bpm/form/delete', { params: { id } })
    },
  }
}

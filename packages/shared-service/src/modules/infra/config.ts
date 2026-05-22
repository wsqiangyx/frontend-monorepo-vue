// ============================================================================
// 配置管理 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ConfigVO } from './types'

export function createConfigApi(http: AxiosInstance) {
  return {
    /** 配置分页 */
    getPage(params: {
      pageNo: number
      pageSize: number
      name?: string
      key?: string
      type?: number
    }) {
      return http.get<{ data: { list: ConfigVO[]; total: number } }>('/infra/config/page', {
        params,
      })
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: ConfigVO }>('/infra/config/get', { params: { id } })
    },
    /** 根据 key 获取值 */
    getKey(key: string) {
      return http.get<{ data: string }>('/infra/config/get-value', { params: { key } })
    },
    /** 新增 */
    create(data: Partial<ConfigVO>) {
      return http.post('/infra/config/create', data)
    },
    /** 修改 */
    update(data: Partial<ConfigVO>) {
      return http.put('/infra/config/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/infra/config/delete', { params: { id } })
    },
    /** 批量删除 */
    deleteList(ids: number[]) {
      return http.delete('/infra/config/delete-list', { params: { ids: ids.join(',') } })
    },
    /** 导出 */
    exportList(params: Record<string, unknown>) {
      return http.get('/infra/config/export', { params, responseType: 'blob' })
    },
  }
}

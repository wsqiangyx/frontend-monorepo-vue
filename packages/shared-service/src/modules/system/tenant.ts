// ============================================================================
// 租户管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { TenantVO, PageResult } from './types'

export function createTenantApi(http: AxiosInstance) {
  return {
    /** 租户分页列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<PageResult<TenantVO>>('/system/tenant/page', { params })
    },

    /** 获取租户详情 */
    get(id: number) {
      return http.get<TenantVO>('/system/tenant/get', { params: { id } })
    },

    /** 新增租户 */
    create(data: Partial<TenantVO>) {
      return http.post('/system/tenant/create', data)
    },

    /** 修改租户 */
    update(data: Partial<TenantVO>) {
      return http.put('/system/tenant/update', data)
    },

    /** 删除租户 */
    delete(id: number) {
      return http.delete('/system/tenant/delete', { params: { id } })
    },
  }
}

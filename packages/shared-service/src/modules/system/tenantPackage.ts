// ============================================================================
// 租户套餐 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { TenantPackageVO, PageResult } from './types'

export function createTenantPackageApi(http: AxiosInstance) {
  return {
    /** 租户套餐分页列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<PageResult<TenantPackageVO>>('/system/tenant-package/page', { params })
    },

    /** 租户套餐简单列表 */
    getSimpleList() {
      return http.get<TenantPackageVO[]>('/system/tenant-package/simple-list')
    },

    /** 获取租户套餐详情 */
    get(id: number) {
      return http.get<TenantPackageVO>('/system/tenant-package/get', { params: { id } })
    },

    /** 新增租户套餐 */
    create(data: Partial<TenantPackageVO>) {
      return http.post('/system/tenant-package/create', data)
    },

    /** 修改租户套餐 */
    update(data: Partial<TenantPackageVO>) {
      return http.put('/system/tenant-package/update', data)
    },

    /** 删除租户套餐 */
    delete(id: number) {
      return http.delete('/system/tenant-package/delete', { params: { id } })
    },
  }
}

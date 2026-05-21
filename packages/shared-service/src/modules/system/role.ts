// ============================================================================
// 角色管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { RoleVO, RoleQuery, PageResult } from './types'

export function createRoleApi(http: AxiosInstance) {
  return {
    /** 角色分页列表 */
    getPage(params: RoleQuery) {
      return http.get<PageResult<RoleVO>>('/system/role/page', { params })
    },

    /** 角色简单列表 */
    getSimpleList() {
      return http.get<RoleVO[]>('/system/role/simple-list')
    },

    /** 获取角色详情 */
    get(id: number) {
      return http.get<RoleVO>('/system/role/get', { params: { id } })
    },

    /** 新增角色 */
    create(data: Partial<RoleVO>) {
      return http.post('/system/role/create', data)
    },

    /** 修改角色 */
    update(data: Partial<RoleVO>) {
      return http.put('/system/role/update', data)
    },

    /** 删除角色 */
    delete(id: number) {
      return http.delete('/system/role/delete', { params: { id } })
    },
  }
}

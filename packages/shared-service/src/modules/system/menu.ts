// ============================================================================
// 菜单管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { MenuVO } from './types'

export function createMenuApi(http: AxiosInstance) {
  return {
    /** 菜单列表（树形） */
    getList() {
      return http.get<MenuVO[]>('/system/menu/list')
    },

    /** 获取菜单详情 */
    get(id: number) {
      return http.get<MenuVO>('/system/menu/get', { params: { id } })
    },

    /** 新增菜单 */
    create(data: Partial<MenuVO>) {
      return http.post('/system/menu/create', data)
    },

    /** 修改菜单 */
    update(data: Partial<MenuVO>) {
      return http.put('/system/menu/update', data)
    },

    /** 删除菜单 */
    delete(id: number) {
      return http.delete('/system/menu/delete', { params: { id } })
    },
  }
}

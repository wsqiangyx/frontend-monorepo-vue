// ============================================================================
// 部门管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { DeptVO } from './types'

export function createDeptApi(http: AxiosInstance) {
  return {
    /** 部门列表（树形） */
    getList() {
      return http.get<DeptVO[]>('/system/dept/list')
    },

    /** 获取部门详情 */
    get(id: number) {
      return http.get<DeptVO>('/system/dept/get', { params: { id } })
    },

    /** 新增部门 */
    create(data: Partial<DeptVO>) {
      return http.post('/system/dept/create', data)
    },

    /** 修改部门 */
    update(data: Partial<DeptVO>) {
      return http.put('/system/dept/update', data)
    },

    /** 删除部门 */
    delete(id: number) {
      return http.delete('/system/dept/delete', { params: { id } })
    },
  }
}

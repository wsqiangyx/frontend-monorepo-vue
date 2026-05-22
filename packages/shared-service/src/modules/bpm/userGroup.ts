// ============================================================================
// 用户分组 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { UserGroupVO } from './types'

export function createUserGroupApi(http: AxiosInstance) {
  return {
    /** 分页 */
    getPage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: UserGroupVO[]; total: number } }>('/bpm/user-group/page', {
        params,
      })
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: UserGroupVO }>('/bpm/user-group/get', { params: { id } })
    },
    /** 创建 */
    create(data: Partial<UserGroupVO>) {
      return http.post('/bpm/user-group/create', data)
    },
    /** 修改 */
    update(data: Partial<UserGroupVO>) {
      return http.put('/bpm/user-group/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/bpm/user-group/delete', { params: { id } })
    },
  }
}

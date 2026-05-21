// ============================================================================
// 岗位管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { PostVO, PageResult } from './types'

export function createPostApi(http: AxiosInstance) {
  return {
    /** 岗位分页列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<PageResult<PostVO>>('/system/post/page', { params })
    },

    /** 岗位简单列表 */
    getSimpleList() {
      return http.get<PostVO[]>('/system/post/simple-list')
    },

    /** 获取岗位详情 */
    get(id: number) {
      return http.get<PostVO>('/system/post/get', { params: { id } })
    },

    /** 新增岗位 */
    create(data: Partial<PostVO>) {
      return http.post('/system/post/create', data)
    },

    /** 修改岗位 */
    update(data: Partial<PostVO>) {
      return http.put('/system/post/update', data)
    },

    /** 删除岗位 */
    delete(id: number) {
      return http.delete('/system/post/delete', { params: { id } })
    },
  }
}

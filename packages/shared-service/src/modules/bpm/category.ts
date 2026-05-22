// ============================================================================
// 流程分类 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { CategoryVO } from './types'

export function createCategoryApi(http: AxiosInstance) {
  return {
    /** 分类分页 */
    getPage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: CategoryVO[]; total: number } }>('/bpm/category/page', {
        params,
      })
    },
    /** 简单列表 */
    getSimpleList() {
      return http.get<{ data: CategoryVO[] }>('/bpm/category/simple-list')
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: CategoryVO }>('/bpm/category/get', { params: { id } })
    },
    /** 创建 */
    create(data: Partial<CategoryVO>) {
      return http.post('/bpm/category/create', data)
    },
    /** 修改 */
    update(data: Partial<CategoryVO>) {
      return http.put('/bpm/category/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/bpm/category/delete', { params: { id } })
    },
    /** 批量更新排序 */
    updateSortBatch(ids: number[]) {
      return http.put('/bpm/category/update-sort-batch', null, { params: { ids: ids.join(',') } })
    },
  }
}

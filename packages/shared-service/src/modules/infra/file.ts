// ============================================================================
// 文件管理 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { FileVO } from './types'

export function createFileApi(http: AxiosInstance) {
  return {
    /** 文件分页 */
    getPage(params: { pageNo: number; pageSize: number; path?: string; type?: string }) {
      return http.get<{ data: { list: FileVO[]; total: number } }>('/infra/file/page', { params })
    },
    /** 删除文件 */
    delete(id: number) {
      return http.delete('/infra/file/delete', { params: { id } })
    },
    /** 批量删除 */
    deleteList(ids: number[]) {
      return http.delete('/infra/file/delete-list', { params: { ids: ids.join(',') } })
    },
  }
}

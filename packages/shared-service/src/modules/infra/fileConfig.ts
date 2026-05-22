// ============================================================================
// 文件配置 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { FileConfigVO } from './types'

export function createFileConfigApi(http: AxiosInstance) {
  return {
    /** 文件配置分页 */
    getPage(params: { pageNo: number; pageSize: number }) {
      return http.get<{ data: { list: FileConfigVO[]; total: number } }>(
        '/infra/file-config/page',
        { params },
      )
    },
    /** 获取全部配置 */
    getList() {
      return http.get<{ data: FileConfigVO[] }>('/infra/file-config/list')
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: FileConfigVO }>('/infra/file-config/get', { params: { id } })
    },
    /** 新增 */
    create(data: Partial<FileConfigVO>) {
      return http.post('/infra/file-config/create', data)
    },
    /** 修改 */
    update(data: Partial<FileConfigVO>) {
      return http.put('/infra/file-config/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/infra/file-config/delete', { params: { id } })
    },
  }
}

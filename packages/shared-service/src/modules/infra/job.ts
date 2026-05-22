// ============================================================================
// 定时任务 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { JobVO, JobLogVO } from './types'

export function createJobApi(http: AxiosInstance) {
  return {
    /** 定时任务分页 */
    getPage(params: {
      pageNo: number
      pageSize: number
      name?: string
      status?: number
      handlerName?: string
    }) {
      return http.get<{ data: { list: JobVO[]; total: number } }>('/infra/job/page', { params })
    },
    /** 获取详情 */
    get(id: number) {
      return http.get<{ data: JobVO }>('/infra/job/get', { params: { id } })
    },
    /** 新增 */
    create(data: Partial<JobVO>) {
      return http.post('/infra/job/create', data)
    },
    /** 修改 */
    update(data: Partial<JobVO>) {
      return http.put('/infra/job/update', data)
    },
    /** 删除 */
    delete(id: number) {
      return http.delete('/infra/job/delete', { params: { id } })
    },
    /** 批量删除 */
    deleteList(ids: number[]) {
      return http.delete('/infra/job/delete-list', { params: { ids: ids.join(',') } })
    },
    /** 修改状态 */
    updateStatus(id: number, status: number) {
      return http.put('/infra/job/update-status', null, { params: { id, status } })
    },
    /** 立即执行一次 */
    run(id: number) {
      return http.put('/infra/job/trigger', null, { params: { id } })
    },
    /** 导出 */
    exportList(params: Record<string, unknown>) {
      return http.get('/infra/job/export', { params, responseType: 'blob' })
    },
  }
}

export function createJobLogApi(http: AxiosInstance) {
  return {
    /** 任务日志分页 */
    getPage(params: { pageNo: number; pageSize: number; jobId?: number; status?: number }) {
      return http.get<{ data: { list: JobLogVO[]; total: number } }>('/infra/job-log/page', {
        params,
      })
    },
    /** 清空日志 */
    clean() {
      return http.delete('/infra/job-log/clean')
    },
  }
}

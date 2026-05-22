// ============================================================================
// 任务管理 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { TaskVO } from './types'

export function createTaskApi(http: AxiosInstance) {
  return {
    /** 我的待办分页 */
    getTodoPage(params: { pageNo: number; pageSize: number; name?: string; category?: string }) {
      return http.get<{ data: { list: TaskVO[]; total: number } }>('/bpm/task/todo-page', {
        params,
      })
    },
    /** 我的已办分页 */
    getDonePage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: TaskVO[]; total: number } }>('/bpm/task/done-page', {
        params,
      })
    },
    /** 全部任务分页 */
    getManagerPage(params: { pageNo: number; pageSize: number; name?: string }) {
      return http.get<{ data: { list: TaskVO[]; total: number } }>('/bpm/task/manager-page', {
        params,
      })
    },
    /** 审批通过 */
    approve(data: { id: string; processInstanceId: string; reason?: string }) {
      return http.put('/bpm/task/approve', data)
    },
    /** 审批拒绝 */
    reject(data: { id: string; processInstanceId: string; reason?: string }) {
      return http.put('/bpm/task/reject', data)
    },
    /** 获取任务列表（根据流程实例） */
    getListByProcessInstanceId(processInstanceId: string) {
      return http.get<{ data: TaskVO[] }>('/bpm/task/list-by-process-instance-id', {
        params: { processInstanceId },
      })
    },
    /** 委派 */
    delegate(data: { id: string; userId: number }) {
      return http.put('/bpm/task/delegate', data)
    },
    /** 转派 */
    transfer(data: { id: string; userId: number }) {
      return http.put('/bpm/task/transfer', data)
    },
    /** 撤回 */
    withdraw(taskId: string) {
      return http.put('/bpm/task/withdraw', null, { params: { taskId } })
    },
  }
}

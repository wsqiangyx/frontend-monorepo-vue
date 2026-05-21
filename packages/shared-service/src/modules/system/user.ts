// ============================================================================
// 用户管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { UserVO, UserQuery, UserForm, PageResult } from './types'

export function createUserApi(http: AxiosInstance) {
  return {
    /** 用户分页列表 */
    getPage(params: UserQuery) {
      return http.get<PageResult<UserVO>>('/system/user/page', { params })
    },

    /** 用户列表（简单） */
    getList(ids?: number[]) {
      return http.get<UserVO[]>('/system/user/list', {
        params: ids?.length ? { ids: ids.join(',') } : undefined,
      })
    },

    /** 获取用户详情 */
    get(id: number) {
      return http.get<UserVO>('/system/user/get', { params: { id } })
    },

    /** 新增用户 */
    create(data: UserForm) {
      return http.post('/system/user/create', data)
    },

    /** 修改用户 */
    update(data: UserForm) {
      return http.put('/system/user/update', data)
    },

    /** 删除用户 */
    delete(id: number) {
      return http.delete('/system/user/delete', { params: { id } })
    },

    /** 批量删除 */
    deleteList(ids: number[]) {
      return http.delete('/system/user/delete-list', {
        params: { ids: ids.join(',') },
      })
    },

    /** 重置密码 */
    resetPassword(id: number, password: string) {
      return http.put('/system/user/update-password', { id, password })
    },

    /** 修改状态 */
    updateStatus(id: number, status: number) {
      return http.put('/system/user/update-status', { id, status })
    },

    /** 导出 */
    exportExcel(params: UserQuery) {
      return http.post('/system/user/export-excel', params, {
        responseType: 'blob',
      })
    },

    /** 导入模板下载 */
    importTemplate() {
      return http.get('/system/user/get-import-template', {
        responseType: 'blob',
      })
    },
  }
}

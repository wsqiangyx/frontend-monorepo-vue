// ============================================================================
// 通知公告 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { NoticeVO, PageResult } from './types'

export function createNoticeApi(http: AxiosInstance) {
  return {
    /** 通知公告分页列表 */
    getPage(params: { pageNo: number; pageSize: number; title?: string; type?: number }) {
      return http.get<PageResult<NoticeVO>>('/system/notice/page', { params })
    },

    /** 获取通知公告详情 */
    get(id: number) {
      return http.get<NoticeVO>('/system/notice/get', { params: { id } })
    },

    /** 新增通知公告 */
    create(data: Partial<NoticeVO>) {
      return http.post('/system/notice/create', data)
    },

    /** 修改通知公告 */
    update(data: Partial<NoticeVO>) {
      return http.put('/system/notice/update', data)
    },

    /** 删除通知公告 */
    delete(id: number) {
      return http.delete('/system/notice/delete', { params: { id } })
    },
  }
}

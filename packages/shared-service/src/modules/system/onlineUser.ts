// ============================================================================
// 在线用户 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { OnlineUserVO, PageResult } from './types'

export function createOnlineUserApi(http: AxiosInstance) {
  return {
    /** 在线用户分页列表 */
    getPage(params: { pageNo: number; pageSize: number; username?: string }) {
      return http.get<PageResult<OnlineUserVO>>('/system/online-user/page', { params })
    },

    /** 强制下线 */
    kick(id: number) {
      return http.delete('/system/online-user/kick', { params: { id } })
    },
  }
}

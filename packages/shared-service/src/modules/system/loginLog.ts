// ============================================================================
// 登录日志 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { LoginLogVO, PageResult } from './types'

export function createLoginLogApi(http: AxiosInstance) {
  return {
    /** 登录日志分页列表 */
    getPage(params: { pageNo: number; pageSize: number; username?: string; loginType?: number }) {
      return http.get<PageResult<LoginLogVO>>('/system/login-log/page', { params })
    },
  }
}

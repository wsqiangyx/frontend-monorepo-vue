// ============================================================================
// 操作日志 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { OperateLogVO, PageResult } from './types'

export function createOperateLogApi(http: AxiosInstance) {
  return {
    /** 操作日志分页列表 */
    getPage(params: {
      pageNo: number
      pageSize: number
      userId?: number
      bizType?: number
      action?: string
    }) {
      return http.get<PageResult<OperateLogVO>>('/system/operate-log/page', { params })
    },
  }
}

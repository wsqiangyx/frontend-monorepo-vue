// ============================================================================
// OAuth2 应用管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { OAuth2ClientVO, PageResult } from './types'

export function createOAuth2ClientApi(http: AxiosInstance) {
  return {
    /** OAuth2 客户端分页列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<PageResult<OAuth2ClientVO>>('/system/oauth2/client/page', { params })
    },

    /** 获取 OAuth2 客户端详情 */
    get(id: number) {
      return http.get<OAuth2ClientVO>('/system/oauth2/client/get', { params: { id } })
    },

    /** 新增 OAuth2 客户端 */
    create(data: Partial<OAuth2ClientVO>) {
      return http.post('/system/oauth2/client/create', data)
    },

    /** 修改 OAuth2 客户端 */
    update(data: Partial<OAuth2ClientVO>) {
      return http.put('/system/oauth2/client/update', data)
    },

    /** 删除 OAuth2 客户端 */
    delete(id: number) {
      return http.delete('/system/oauth2/client/delete', { params: { id } })
    },
  }
}

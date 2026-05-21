// ============================================================================
// 邮件管理 API (账号 + 模板 + 日志)
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { MailAccountVO, MailTemplateVO, MailLogVO, PageResult } from './types'

export function createMailAccountApi(http: AxiosInstance) {
  return {
    /** 邮箱账号分页列表 */
    getPage(params: { pageNo: number; pageSize: number; mail?: string }) {
      return http.get<PageResult<MailAccountVO>>('/system/mail/account/page', { params })
    },

    /** 邮箱账号简单列表 */
    getSimpleList() {
      return http.get<MailAccountVO[]>('/system/mail/account/simple-list')
    },

    /** 获取邮箱账号详情 */
    get(id: number) {
      return http.get<MailAccountVO>('/system/mail/account/get', { params: { id } })
    },

    /** 新增邮箱账号 */
    create(data: Partial<MailAccountVO>) {
      return http.post('/system/mail/account/create', data)
    },

    /** 修改邮箱账号 */
    update(data: Partial<MailAccountVO>) {
      return http.put('/system/mail/account/update', data)
    },

    /** 删除邮箱账号 */
    delete(id: number) {
      return http.delete('/system/mail/account/delete', { params: { id } })
    },
  }
}

export function createMailTemplateApi(http: AxiosInstance) {
  return {
    /** 邮件模板分页列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<PageResult<MailTemplateVO>>('/system/mail/template/page', { params })
    },

    /** 获取邮件模板详情 */
    get(id: number) {
      return http.get<MailTemplateVO>('/system/mail/template/get', { params: { id } })
    },

    /** 新增邮件模板 */
    create(data: Partial<MailTemplateVO>) {
      return http.post('/system/mail/template/create', data)
    },

    /** 修改邮件模板 */
    update(data: Partial<MailTemplateVO>) {
      return http.put('/system/mail/template/update', data)
    },

    /** 删除邮件模板 */
    delete(id: number) {
      return http.delete('/system/mail/template/delete', { params: { id } })
    },
  }
}

export function createMailLogApi(http: AxiosInstance) {
  return {
    /** 邮件日志分页列表 */
    getPage(params: {
      pageNo: number
      pageSize: number
      mail?: string
      templateId?: number
      sendStatus?: number
    }) {
      return http.get<PageResult<MailLogVO>>('/system/mail/log/page', { params })
    },
  }
}

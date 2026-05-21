// ============================================================================
// 短信管理 API (渠道 + 模板 + 日志)
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { SmsChannelVO, SmsTemplateVO, SmsLogVO, PageResult } from './types'

export function createSmsChannelApi(http: AxiosInstance) {
  return {
    /** 短信渠道分页列表 */
    getPage(params: { pageNo: number; pageSize: number; status?: number }) {
      return http.get<PageResult<SmsChannelVO>>('/system/sms/channel/page', { params })
    },

    /** 短信渠道简单列表 */
    getSimpleList() {
      return http.get<SmsChannelVO[]>('/system/sms/channel/simple-list')
    },

    /** 获取短信渠道详情 */
    get(id: number) {
      return http.get<SmsChannelVO>('/system/sms/channel/get', { params: { id } })
    },

    /** 新增短信渠道 */
    create(data: Partial<SmsChannelVO>) {
      return http.post('/system/sms/channel/create', data)
    },

    /** 修改短信渠道 */
    update(data: Partial<SmsChannelVO>) {
      return http.put('/system/sms/channel/update', data)
    },

    /** 删除短信渠道 */
    delete(id: number) {
      return http.delete('/system/sms/channel/delete', { params: { id } })
    },
  }
}

export function createSmsTemplateApi(http: AxiosInstance) {
  return {
    /** 短信模板分页列表 */
    getPage(params: { pageNo: number; pageSize: number; type?: number; status?: number }) {
      return http.get<PageResult<SmsTemplateVO>>('/system/sms/template/page', { params })
    },

    /** 获取短信模板详情 */
    get(id: number) {
      return http.get<SmsTemplateVO>('/system/sms/template/get', { params: { id } })
    },

    /** 新增短信模板 */
    create(data: Partial<SmsTemplateVO>) {
      return http.post('/system/sms/template/create', data)
    },

    /** 修改短信模板 */
    update(data: Partial<SmsTemplateVO>) {
      return http.put('/system/sms/template/update', data)
    },

    /** 删除短信模板 */
    delete(id: number) {
      return http.delete('/system/sms/template/delete', { params: { id } })
    },
  }
}

export function createSmsLogApi(http: AxiosInstance) {
  return {
    /** 短信日志分页列表 */
    getPage(params: {
      pageNo: number
      pageSize: number
      mobile?: string
      templateCode?: string
      sendStatus?: number
    }) {
      return http.get<PageResult<SmsLogVO>>('/system/sms/log/page', { params })
    },
  }
}

import type { AxiosInstance } from 'axios'
import type { NotifyVO } from './types'

export function createPayNotifyApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: NotifyVO[]; total: number } }>('/pay/notify/page', { params })
    },
    get(id: number) {
      return http.get<{ data: NotifyVO }>('/pay/notify/get', { params: { id } })
    },
  }
}

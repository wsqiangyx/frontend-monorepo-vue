import type { AxiosInstance } from 'axios'
import type { ChannelVO } from './types'

export function createPayChannelApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: ChannelVO[]; total: number } }>('/pay/channel/page', {
        params,
      })
    },
    get(appId: number, code: string) {
      return http.get<{ data: ChannelVO }>('/pay/channel/get', { params: { appId, code } })
    },
    create(data: Partial<ChannelVO>) {
      return http.post('/pay/channel/create', data)
    },
    update(data: Partial<ChannelVO>) {
      return http.put('/pay/channel/update', data)
    },
    delete(id: number) {
      return http.delete('/pay/channel/delete', { params: { id } })
    },
  }
}

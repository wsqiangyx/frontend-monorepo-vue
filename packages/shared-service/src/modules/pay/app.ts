import type { AxiosInstance } from 'axios'
import type { AppVO } from './types'

export function createPayAppApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: AppVO[]; total: number } }>('/pay/app/page', { params })
    },
    get(id: number) {
      return http.get<{ data: AppVO }>('/pay/app/get', { params: { id } })
    },
    create(data: Partial<AppVO>) {
      return http.post('/pay/app/create', data)
    },
    update(data: Partial<AppVO>) {
      return http.put('/pay/app/update', data)
    },
    delete(id: number) {
      return http.delete('/pay/app/delete', { params: { id } })
    },
    updateStatus(id: number, status: number) {
      return http.put('/pay/app/update-status', { id, status })
    },
    list() {
      return http.get<{ data: AppVO[] }>('/pay/app/list')
    },
  }
}

import type { AxiosInstance } from 'axios'
import type { OrderVO } from './types'

export function createPayOrderApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: OrderVO[]; total: number } }>('/pay/order/page', { params })
    },
    get(id: number, sync?: boolean) {
      return http.get<{ data: OrderVO }>('/pay/order/get', { params: { id, sync } })
    },
    getDetail(id: number) {
      return http.get<{ data: OrderVO }>('/pay/order/get-detail', { params: { id } })
    },
    exportExcel(params: Record<string, unknown>) {
      return http.get('/pay/order/export-excel', { params, responseType: 'blob' })
    },
  }
}

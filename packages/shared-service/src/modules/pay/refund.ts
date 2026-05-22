import type { AxiosInstance } from 'axios'
import type { RefundVO } from './types'

export function createPayRefundApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: RefundVO[]; total: number } }>('/pay/refund/page', { params })
    },
    get(id: number) {
      return http.get<{ data: RefundVO }>('/pay/refund/get', { params: { id } })
    },
    create(data: Partial<RefundVO>) {
      return http.post('/pay/refund/create', data)
    },
    update(data: Partial<RefundVO>) {
      return http.put('/pay/refund/update', data)
    },
    delete(id: number) {
      return http.delete('/pay/refund/delete', { params: { id } })
    },
    exportExcel(params: Record<string, unknown>) {
      return http.get('/pay/refund/export-excel', { params, responseType: 'blob' })
    },
  }
}

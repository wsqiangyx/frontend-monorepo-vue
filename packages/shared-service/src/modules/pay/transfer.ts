import type { AxiosInstance } from 'axios'
import type { TransferVO } from './types'

export function createPayTransferApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: TransferVO[]; total: number } }>('/pay/transfer/page', {
        params,
      })
    },
    get(id: number) {
      return http.get<{ data: TransferVO }>('/pay/transfer/get', { params: { id } })
    },
    create(data: Partial<TransferVO>) {
      return http.post('/pay/transfer/create', data)
    },
    exportExcel(params: Record<string, unknown>) {
      return http.get('/pay/transfer/export-excel', { params, responseType: 'blob' })
    },
  }
}

import type { AxiosInstance } from 'axios'
import type { WalletBalanceVO, WalletRechargePackageVO, WalletTransactionVO } from './types'

export function createWalletBalanceApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: WalletBalanceVO[]; total: number } }>(
        '/pay/wallet/balance/page',
        { params },
      )
    },
    get(id: number) {
      return http.get<{ data: WalletBalanceVO }>('/pay/wallet/balance/get', { params: { id } })
    },
  }
}

export function createWalletRechargePackageApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: WalletRechargePackageVO[]; total: number } }>(
        '/pay/wallet/recharge-package/page',
        { params },
      )
    },
    get(id: number) {
      return http.get<{ data: WalletRechargePackageVO }>('/pay/wallet/recharge-package/get', {
        params: { id },
      })
    },
    create(data: Partial<WalletRechargePackageVO>) {
      return http.post('/pay/wallet/recharge-package/create', data)
    },
    update(data: Partial<WalletRechargePackageVO>) {
      return http.put('/pay/wallet/recharge-package/update', data)
    },
    delete(id: number) {
      return http.delete('/pay/wallet/recharge-package/delete', { params: { id } })
    },
  }
}

export function createWalletTransactionApi(http: AxiosInstance) {
  return {
    getPage(params: Record<string, unknown>) {
      return http.get<{ data: { list: WalletTransactionVO[]; total: number } }>(
        '/pay/wallet/transaction/page',
        { params },
      )
    },
    get(id: number) {
      return http.get<{ data: WalletTransactionVO }>('/pay/wallet/transaction/get', {
        params: { id },
      })
    },
  }
}

// ============================================================================
// Redis 监控 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { RedisMonitorInfoVO, RedisKeyVO } from './types'

export function createRedisApi(http: AxiosInstance) {
  return {
    /** 获取 Redis 监控信息 */
    getCache() {
      return http.get<{ data: RedisMonitorInfoVO }>('/infra/redis/get-monitor-info')
    },
    /** 获取 Key 列表 */
    getKeyList(params: { keyPattern?: string }) {
      return http.get<{ data: RedisKeyVO[] }>('/infra/redis/get-key-list', { params })
    },
    /** 删除 Key */
    deleteKey(key: string) {
      return http.delete('/infra/redis/delete-key', { params: { key } })
    },
  }
}

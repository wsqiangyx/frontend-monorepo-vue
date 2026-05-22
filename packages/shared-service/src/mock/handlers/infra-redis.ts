// ============================================================================
// Redis 监控 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success } from '../helpers'

const mockRedisInfo = {
  info: {
    redis_version: '7.2.4',
    redis_mode: 'standalone',
    tcp_port: '6379',
    connected_clients: '3',
    uptime_in_days: '45',
    used_memory_human: '1.82M',
    used_cpu_user_children: '0.15',
    maxmemory_human: '256.00M',
    aof_enabled: '0',
    rdb_last_bgsave_status: 'ok',
    instantaneous_input_kbps: '12.50',
    instantaneous_output_kbps: '35.20',
  },
  dbSize: 1256,
  commandStats: [
    { command: 'GET', calls: 45000 },
    { command: 'SET', calls: 12000 },
    { command: 'HGET', calls: 8500 },
    { command: 'HSET', calls: 3200 },
    { command: 'DEL', calls: 1500 },
    { command: 'EXPIRE', calls: 2800 },
    { command: 'KEYS', calls: 150 },
    { command: 'MGET', calls: 5600 },
    { command: 'INCR', calls: 890 },
    { command: 'PUBLISH', calls: 2400 },
  ],
}

const mockKeys = [
  { key: 'user:token:abc123', ttl: 3600, type: 'string', value: '{"userId":1}' },
  { key: 'user:token:def456', ttl: 1800, type: 'string', value: '{"userId":2}' },
  { key: 'captcha:code:xyz', ttl: 300, type: 'string', value: 'a3f5' },
  { key: 'system:config', ttl: -1, type: 'hash', value: '6 fields' },
  { key: 'online:users', ttl: -1, type: 'set', value: '3 members' },
  { key: 'cache:menu:1', ttl: 7200, type: 'string', value: '[...]' },
]

export const infraRedisHandlers = [
  // Redis 监控信息
  http.get('*/infra/redis/get-monitor-info', async () => {
    await delay(200)
    return HttpResponse.json(success(mockRedisInfo))
  }),

  // Key 列表
  http.get('*/infra/redis/get-key-list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const keyPattern = url.searchParams.get('keyPattern')
    let filtered = [...mockKeys]
    if (keyPattern) filtered = filtered.filter((k) => k.key.includes(keyPattern))
    return HttpResponse.json(success(filtered))
  }),

  // 删除 Key
  http.delete('*/infra/redis/delete-key', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const key = url.searchParams.get('key')
    const index = mockKeys.findIndex((k) => k.key === key)
    if (index !== -1) mockKeys.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

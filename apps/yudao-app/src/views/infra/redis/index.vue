<template>
  <PageContainer title="Redis 监控">
    <t-row :gutter="16">
      <!-- 基本信息 -->
      <t-col :span="24">
        <t-card title="基本信息" class="mb-4">
          <t-descriptions :column="4" bordered>
            <t-descriptions-item label="Redis 版本">{{ cache?.info?.redis_version }}</t-descriptions-item>
            <t-descriptions-item label="运行模式">{{ cache?.info?.redis_mode === 'standalone' ? '单机' : '集群' }}</t-descriptions-item>
            <t-descriptions-item label="端口">{{ cache?.info?.tcp_port }}</t-descriptions-item>
            <t-descriptions-item label="客户端数">{{ cache?.info?.connected_clients }}</t-descriptions-item>
            <t-descriptions-item label="运行时间(天)">{{ cache?.info?.uptime_in_days }}</t-descriptions-item>
            <t-descriptions-item label="使用内存">{{ cache?.info?.used_memory_human }}</t-descriptions-item>
            <t-descriptions-item label="使用 CPU">{{ cache?.info ? parseFloat(cache.info.used_cpu_user_children).toFixed(2) : '' }}</t-descriptions-item>
            <t-descriptions-item label="内存配置">{{ cache?.info?.maxmemory_human }}</t-descriptions-item>
            <t-descriptions-item label="AOF 是否开启">{{ cache?.info?.aof_enabled === '0' ? '否' : '是' }}</t-descriptions-item>
            <t-descriptions-item label="RDB 是否成功">{{ cache?.info?.rdb_last_bgsave_status }}</t-descriptions-item>
            <t-descriptions-item label="Key 数量">{{ cache?.dbSize }}</t-descriptions-item>
            <t-descriptions-item label="网络入口/出口">{{ cache?.info?.instantaneous_input_kbps }}kps / {{ cache?.info?.instantaneous_output_kbps }}kps</t-descriptions-item>
          </t-descriptions>
        </t-card>
      </t-col>
    </t-row>

    <t-row :gutter="16">
      <!-- 命令统计 -->
      <t-col :span="12">
        <t-card title="命令统计" class="mb-4">
          <div ref="commandChartRef" style="height: 400px"></div>
        </t-card>
      </t-col>
      <!-- 内存使用 -->
      <t-col :span="12">
        <t-card title="内存使用情况" class="mb-4">
          <div ref="memoryChartRef" style="height: 400px"></div>
        </t-card>
      </t-col>
    </t-row>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraRedis' })

interface RedisInfo {
  redis_version: string
  redis_mode: string
  tcp_port: string
  connected_clients: string
  uptime_in_days: string
  used_memory_human: string
  used_cpu_user_children: string
  maxmemory_human: string
  aof_enabled: string
  rdb_last_bgsave_status: string
  instantaneous_input_kbps: string
  instantaneous_output_kbps: string
}

interface RedisMonitorInfo {
  info: RedisInfo
  dbSize: number
  commandStats: Array<{ command: string; calls: number }>
}

const cache = ref<RedisMonitorInfo | null>(null)
const commandChartRef = ref<HTMLElement>()
const memoryChartRef = ref<HTMLElement>()

async function fetchRedisInfo() {
  try {
    const res = await fetch('/api/infra/redis/get-monitor-info')
    const json = await res.json()
    if (json.success) {
      cache.value = json.data
    }
  } catch {
    ElMessage.error('获取 Redis 信息失败')
  }
}

onMounted(() => {
  fetchRedisInfo()
})
</script>

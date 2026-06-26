<template>
  <PageContainer title="支付通知">
    <t-card>
      <t-space class="mb-4">
        <t-input v-model="searchForm.merchantOrderId" placeholder="商户订单号" style="width: 200px" />
        <t-button theme="primary" @click="fetchData">查询</t-button>
        <t-button @click="searchForm = {}">重置</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 20 ? 'success' : 'warning'">
            {{ { 10: '通知中', 20: '通知成功', 30: '通知失败' }[row.status as number] || '未知' }}
          </t-tag>
        </template>
        <template #notifyType="{ row }">
          <t-tag>{{ { 1: '支付通知', 2: '退款通知', 3: '转账通知' }[row.notifyType as number] || '未知' }}</t-tag>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'PayNotify' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const searchForm = ref<Record<string, unknown>>({})
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'merchantOrderId', title: '商户订单号' },
  { colKey: 'channelCode', title: '支付渠道', width: 100 },
  { colKey: 'notifyType', title: '通知类型', width: 100 },
  { colKey: 'status', title: '通知状态', width: 100 },
  { colKey: 'times', title: '通知次数', width: 90 },
  { colKey: 'lastExecuteTime', title: '最后通知时间', width: 170 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams({ pageNo: '1', pageSize: '50' })
    if (searchForm.value.merchantOrderId) params.set('merchantOrderId', String(searchForm.value.merchantOrderId))
    const res = await fetch(`/api/pay/notify/page?${params}`)
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { ElMessage.error('加载失败') } finally { loading.value = false }
}

onMounted(fetchData)
</script>

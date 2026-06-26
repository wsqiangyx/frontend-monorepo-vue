<template>
  <PageContainer title="支付订单">
    <t-card>
      <t-space class="mb-4">
        <t-input v-model="searchForm.merchantOrderId" placeholder="商户订单号" style="width: 200px" />
        <t-select v-model="searchForm.status" placeholder="订单状态" clearable style="width: 150px">
          <t-option :value="10" label="未支付" />
          <t-option :value="20" label="已支付" />
          <t-option :value="30" label="已关闭" />
        </t-select>
        <t-button theme="primary" @click="fetchData">查询</t-button>
        <t-button @click="searchForm = {}">重置</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 20 ? 'success' : row.status === 10 ? 'warning' : 'danger'">
            {{ { 10: '未支付', 20: '已支付', 30: '已关闭' }[row.status as number] || '未知' }}
          </t-tag>
        </template>
        <template #amount="{ row }">
          {{ (row.amount / 100).toFixed(2) }}
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleDetail(row)">详情</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'PayOrder' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const searchForm = ref<Record<string, unknown>>({})
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'merchantOrderId', title: '商户订单号' },
  { colKey: 'subject', title: '商品名称' },
  { colKey: 'channelCode', title: '支付渠道', width: 100 },
  { colKey: 'amount', title: '支付金额(元)', width: 120 },
  { colKey: 'status', title: '订单状态', width: 100 },
  { colKey: 'successTime', title: '支付时间', width: 170 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 100, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams({ pageNo: '1', pageSize: '50' })
    if (searchForm.value.merchantOrderId) params.set('merchantOrderId', String(searchForm.value.merchantOrderId))
    if (searchForm.value.status !== undefined && searchForm.value.status !== '') params.set('status', String(searchForm.value.status))
    const res = await fetch(`/api/pay/order/page?${params}`)
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { ElMessage.error('加载失败') } finally { loading.value = false }
}

function handleDetail(row: Record<string, unknown>) {
  ElMessage.info('订单详情：' + row.merchantOrderId)
}

onMounted(fetchData)
</script>

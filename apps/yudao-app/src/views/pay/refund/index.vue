<template>
  <PageContainer title="退款订单">
    <t-card>
      <t-space class="mb-4">
        <t-input v-model="searchForm.merchantRefundNo" placeholder="退款单号" style="width: 200px" />
        <t-select v-model="searchForm.status" placeholder="退款状态" clearable style="width: 150px">
          <t-option :value="10" label="退款中" />
          <t-option :value="20" label="退款成功" />
          <t-option :value="30" label="退款失败" />
        </t-select>
        <t-button theme="primary" @click="fetchData">查询</t-button>
        <t-button @click="searchForm = {}">重置</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 20 ? 'success' : row.status === 10 ? 'warning' : 'danger'">
            {{ { 10: '退款中', 20: '退款成功', 30: '退款失败' }[row.status as number] || '未知' }}
          </t-tag>
        </template>
        <template #refundAmount="{ row }">
          {{ (row.refundAmount / 100).toFixed(2) }}
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

defineOptions({ name: 'PayRefund' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const searchForm = ref<Record<string, unknown>>({})
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'merchantRefundNo', title: '退款单号' },
  { colKey: 'merchantOrderId', title: '订单号' },
  { colKey: 'channelCode', title: '支付渠道', width: 100 },
  { colKey: 'refundAmount', title: '退款金额(元)', width: 120 },
  { colKey: 'reason', title: '退款原因', ellipsis: true },
  { colKey: 'status', title: '退款状态', width: 100 },
  { colKey: 'successTime', title: '退款时间', width: 170 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 100, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams({ pageNo: '1', pageSize: '50' })
    if (searchForm.value.merchantRefundNo) params.set('merchantRefundNo', String(searchForm.value.merchantRefundNo))
    if (searchForm.value.status !== undefined && searchForm.value.status !== '') params.set('status', String(searchForm.value.status))
    const res = await fetch(`/api/pay/refund/page?${params}`)
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { ElMessage.error('加载失败') } finally { loading.value = false }
}

function handleDetail(row: Record<string, unknown>) {
  ElMessage.info('退款详情：' + row.merchantRefundNo)
}

onMounted(fetchData)
</script>

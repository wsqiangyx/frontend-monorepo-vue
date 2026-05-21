<template>
  <PageContainer title="短信日志">
    <t-card>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #sendStatus="{ row }">
          <t-tag :theme="row.sendStatus === 0 ? 'success' : 'danger'" variant="light">
            {{ row.sendStatus === 0 ? '成功' : '失败' }}
          </t-tag>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'SmsLog' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'channelCode', title: '短信渠道' },
  { colKey: 'templateCode', title: '模板编码' },
  { colKey: 'mobile', title: '手机号' },
  { colKey: 'content', title: '短信内容', ellipsis: true },
  { colKey: 'sendStatus', title: '发送状态', width: 100 },
  { colKey: 'sendTime', title: '发送时间', width: 170 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/sms/log/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

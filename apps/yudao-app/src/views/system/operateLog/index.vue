<template>
  <PageContainer title="操作日志">
    <t-card>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #resultCode="{ row }">
          <t-tag :theme="row.resultCode === 0 ? 'success' : 'danger'" variant="light">
            {{ row.resultCode === 0 ? '成功' : '失败' }}
          </t-tag>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'OperateLog' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'userName', title: '操作人' },
  { colKey: 'action', title: '操作内容' },
  { colKey: 'httpMethod', title: '请求方式', width: 100 },
  { colKey: 'url', title: '请求地址', ellipsis: true },
  { colKey: 'resultCode', title: '结果', width: 80 },
  { colKey: 'duration', title: '耗时(ms)', width: 100 },
  { colKey: 'userIp', title: 'IP', width: 130 },
  { colKey: 'createTime', title: '操作时间', width: 170 },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/operate-log/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

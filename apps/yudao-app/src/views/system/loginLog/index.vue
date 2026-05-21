<template>
  <PageContainer title="登录日志">
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

defineOptions({ name: 'LoginLog' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'username', title: '用户名' },
  { colKey: 'userIp', title: 'IP 地址', width: 130 },
  { colKey: 'userAgent', title: '浏览器', ellipsis: true },
  { colKey: 'resultCode', title: '结果', width: 80 },
  { colKey: 'resultMsg', title: '提示消息' },
  { colKey: 'loginDate', title: '登录日期', width: 120 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/login-log/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

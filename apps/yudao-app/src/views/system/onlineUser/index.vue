<template>
  <PageContainer title="在线用户">
    <t-card>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #action="{ row }">
          <t-popconfirm content="确认强制下线该用户？" @confirm="handleKick(row)">
            <t-link theme="danger">强退</t-link>
          </t-popconfirm>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'OnlineUser' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'username', title: '用户名' },
  { colKey: 'userIp', title: 'IP 地址', width: 130 },
  { colKey: 'userAgent', title: '浏览器', ellipsis: true },
  { colKey: 'loginTime', title: '登录时间', width: 170 },
  { colKey: 'action', title: '操作', width: 100, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/online-user/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

async function handleKick(row: Record<string, unknown>) {
  await fetch(`/api/system/online-user/kick?id=${row.id}`, { method: 'DELETE' })
  ElMessage.success('强制下线成功')
  fetchData()
}

onMounted(fetchData)
</script>

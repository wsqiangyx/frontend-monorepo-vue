<template>
  <PageContainer title="我的待办">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="68px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="8">
            <t-form-item label="任务名称" name="name">
              <t-input v-model="queryParams.name" placeholder="请输入任务名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">搜索</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>

      <!-- 数据表格 -->
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @page-change="onPageChange"
      >
        <template #processInstance="{ row }">
          <div v-if="row.processInstance">
            <div class="font-medium">{{ row.processInstance.processDefinitionName }}</div>
            <div v-if="row.processInstance.summary?.length" class="text-sm text-gray-500">
              <span v-for="(item, i) in row.processInstance.summary" :key="i">
                {{ item.key }}: {{ item.value }}{{ i < row.processInstance.summary.length - 1 ? ' | ' : '' }}
              </span>
            </div>
          </div>
        </template>
        <template #startUser="{ row }">
          {{ row.processInstance?.startUserNickname }}
        </template>
        <template #createTime="{ row }">
          {{ row.processInstance?.createTime }}
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleAudit(row)">办理</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 办理弹窗 -->
    <t-dialog v-model:visible="auditVisible" header="审批" width="600px" @confirm="handleAuditSubmit">
      <t-form :data="auditData" label-width="80px">
        <t-form-item label="审批结果">
          <t-radio-group v-model="auditData.action">
            <t-radio value="approve">同意</t-radio>
            <t-radio value="reject">拒绝</t-radio>
            <t-radio value="delegate">委派</t-radio>
            <t-radio value="transfer">转办</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item v-if="auditData.action === 'delegate' || auditData.action === 'transfer'" label="目标用户">
          <t-input v-model="auditData.targetUserId" placeholder="请输入目标用户ID" />
        </t-form-item>
        <t-form-item label="审批意见">
          <t-textarea v-model="auditData.reason" placeholder="请输入审批意见" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmTodoTask' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const auditVisible = ref(false)
const auditData = ref<Record<string, unknown>>({ action: 'approve', reason: '', targetUserId: '' })
const currentTaskId = ref('')

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined as string | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showSizeChanger: true,
})

const columns = [
  { colKey: 'processInstance', title: '流程', width: 250 },
  { colKey: 'startUser', title: '发起人', width: 100 },
  { colKey: 'createTime', title: '发起时间', width: 170 },
  { colKey: 'name', title: '当前任务', width: 150 },
  { colKey: 'id', title: '任务编号', width: 120, ellipsis: true },
  { colKey: 'action', title: '操作', width: 80, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.name) params.set('name', queryParams.name)
    const res = await fetch(`/api/bpm/task/todo-page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    ElMessage.error('加载待办列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.pageNo = 1
  pagination.current = 1
  fetchData()
}

function handleReset() {
  queryParams.name = undefined
  handleSearch()
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  queryParams.pageNo = pageInfo.current
  queryParams.pageSize = pageInfo.pageSize
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleAudit(row: Record<string, unknown>) {
  currentTaskId.value = row.id as string
  auditData.value = { action: 'approve', reason: '', targetUserId: '' }
  auditVisible.value = true
}

async function handleAuditSubmit() {
  const { action, reason, targetUserId } = auditData.value
  try {
    let url = ''
    const body: Record<string, unknown> = { id: currentTaskId.value, reason }
    if (action === 'approve') {
      url = '/api/bpm/task/approve'
    } else if (action === 'reject') {
      url = '/api/bpm/task/reject'
    } else if (action === 'delegate') {
      url = '/api/bpm/task/delegate'
      body.targetUserId = targetUserId
    } else if (action === 'transfer') {
      url = '/api/bpm/task/transfer'
      body.targetUserId = targetUserId
    }
    await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    ElMessage.success('操作成功')
    auditVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('操作失败')
  }
}

onMounted(fetchData)
</script>

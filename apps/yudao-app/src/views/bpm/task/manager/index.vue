<template>
  <PageContainer title="全部任务">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="68px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="任务名称" name="name">
              <t-input v-model="queryParams.name" placeholder="请输入任务名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="状态" name="status">
              <t-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <t-option :value="1" label="进行中" />
                <t-option :value="2" label="已完成" />
                <t-option :value="3" label="已取消" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
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
        <template #status="{ row }">
          <t-tag :theme="statusTheme(row.status)">
            {{ statusLabel(row.status) }}
          </t-tag>
        </template>
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
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleDetail(row)">详情</t-link>
            <t-link v-if="row.status === 1" theme="warning" @click="handleCancel(row)">取消</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmManagerTask' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined as string | undefined,
  status: undefined as number | undefined,
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
  { colKey: 'name', title: '任务名称', width: 150 },
  { colKey: 'status', title: '状态', width: 100 },
  { colKey: 'assigneeUser', title: '处理人', width: 100 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'endTime', title: '完成时间', width: 170 },
  { colKey: 'action', title: '操作', width: 120, fixed: 'right' as const },
]

function statusTheme(status: number) {
  const map: Record<number, string> = { 1: 'warning', 2: 'success', 3: 'default' }
  return (map[status] ?? 'default') as 'warning' | 'success' | 'default'
}

function statusLabel(status: number) {
  const map: Record<number, string> = { 1: '进行中', 2: '已完成', 3: '已取消' }
  return map[status] ?? '未知'
}

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.name) params.set('name', queryParams.name)
    if (queryParams.status !== undefined) params.set('status', String(queryParams.status))
    const res = await fetch(`/api/bpm/task/manager-page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    ElMessage.error('加载任务列表失败')
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
  queryParams.status = undefined
  handleSearch()
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  queryParams.pageNo = pageInfo.current
  queryParams.pageSize = pageInfo.pageSize
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleDetail(row: Record<string, unknown>) {
  ElMessage.info('查看详情：' + row.id)
}

async function handleCancel(row: Record<string, unknown>) {
  try {
    await fetch(`/api/bpm/process-instance/cancel?id=${row.processInstanceId}`, { method: 'PUT' })
    ElMessage.success('取消成功')
    fetchData()
  } catch {
    ElMessage.error('取消失败')
  }
}

onMounted(fetchData)
</script>

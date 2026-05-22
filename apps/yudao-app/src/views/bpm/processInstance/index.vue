<template>
  <PageContainer title="流程实例">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="流程名称" name="name">
              <t-input v-model="queryParams.name" placeholder="请输入流程名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="流程状态" name="status">
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
          <t-tag :theme="getStatusTheme(row.status)">
            {{ getStatusLabel(row.status) }}
          </t-tag>
        </template>
        <template #summary="{ row }">
          <div v-if="row.summary?.length">
            <div v-for="(item, i) in row.summary" :key="i" class="text-sm text-gray-500">
              {{ item.key }}: {{ item.value }}
            </div>
          </div>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleDetail(row)">详情</t-link>
            <t-popconfirm v-if="row.status === 1" content="确认取消该流程？" @confirm="handleCancel(row)">
              <t-link theme="danger">取消</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmProcessInstance' })

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
  { colKey: 'id', title: '流程编号', width: 100, ellipsis: true },
  { colKey: 'name', title: '流程名称', width: 180 },
  { colKey: 'processDefinitionName', title: '流程定义', width: 120 },
  { colKey: 'startUserNickname', title: '发起人', width: 100 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'summary', title: '摘要', width: 200 },
  { colKey: 'createTime', title: '发起时间', width: 170 },
  { colKey: 'action', title: '操作', width: 120, fixed: 'right' as const },
]

function getStatusTheme(status: number) {
  if (status === 1) return 'primary'
  if (status === 2) return 'success'
  return 'warning'
}

function getStatusLabel(status: number) {
  if (status === 1) return '进行中'
  if (status === 2) return '已完成'
  return '已取消'
}

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.name) params.set('name', queryParams.name)
    if (queryParams.status !== undefined) params.set('status', String(queryParams.status))
    const res = await fetch(`/api/bpm/process-instance/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    MessagePlugin.error('加载流程实例失败')
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
  MessagePlugin.info('查看详情：' + row.id)
}

async function handleCancel(row: Record<string, unknown>) {
  try {
    await fetch(`/api/bpm/process-instance/cancel?id=${row.id}`, { method: 'PUT' })
    MessagePlugin.success('取消成功')
    fetchData()
  } catch {
    MessagePlugin.error('取消失败')
  }
}

onMounted(fetchData)
</script>

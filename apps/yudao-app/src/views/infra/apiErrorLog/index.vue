<template>
  <PageContainer title="API 错误日志">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="用户编号" name="userId">
              <t-input v-model="queryParams.userId" placeholder="请输入用户编号" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="应用名" name="applicationName">
              <t-input v-model="queryParams.applicationName" placeholder="请输入应用名" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="处理状态" name="processStatus">
              <t-select v-model="queryParams.processStatus" placeholder="请选择" clearable>
                <t-option :value="0" label="未处理" />
                <t-option :value="1" label="已处理" />
                <t-option :value="2" label="已忽略" />
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
        <template #processStatus="{ row }">
          <t-tag :theme="getProcessStatusTheme(row.processStatus)">
            {{ getProcessStatusLabel(row.processStatus) }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleDetail(row)">详细</t-link>
            <t-link
              v-if="row.processStatus === 0"
              theme="primary"
              @click="handleProcess(row.id, 1)"
            >
              已处理
            </t-link>
            <t-link
              v-if="row.processStatus === 0"
              theme="warning"
              @click="handleProcess(row.id, 2)"
            >
              已忽略
            </t-link>
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

defineOptions({ name: 'InfraApiErrorLog' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined as string | undefined,
  applicationName: undefined as string | undefined,
  processStatus: undefined as number | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showSizeChanger: true,
})

const columns = [
  { colKey: 'id', title: '日志编号', width: 80 },
  { colKey: 'userId', title: '用户编号', width: 80 },
  { colKey: 'applicationName', title: '应用名', width: 150 },
  { colKey: 'requestMethod', title: '请求方法', width: 80 },
  { colKey: 'requestUrl', title: '请求地址', ellipsis: true },
  { colKey: 'exceptionTime', title: '异常时间', width: 170 },
  { colKey: 'exceptionName', title: '异常名', width: 200 },
  { colKey: 'processStatus', title: '处理状态', width: 100 },
  { colKey: 'action', title: '操作', width: 200, fixed: 'right' as const },
]

function getProcessStatusTheme(status: number) {
  if (status === 1) return 'success'
  if (status === 2) return 'warning'
  return 'danger'
}

function getProcessStatusLabel(status: number) {
  if (status === 1) return '已处理'
  if (status === 2) return '已忽略'
  return '未处理'
}

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.userId) params.set('userId', queryParams.userId)
    if (queryParams.applicationName) params.set('applicationName', queryParams.applicationName)
    if (queryParams.processStatus !== undefined) params.set('processStatus', String(queryParams.processStatus))
    const res = await fetch(`/api/infra/api-error-log/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    MessagePlugin.error('加载日志列表失败')
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
  queryParams.userId = undefined
  queryParams.applicationName = undefined
  queryParams.processStatus = undefined
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

async function handleProcess(id: number, processStatus: number) {
  try {
    await fetch(`/api/infra/api-error-log/update-status?id=${id}&processStatus=${processStatus}`, { method: 'PUT' })
    MessagePlugin.success(processStatus === 1 ? '已标记为已处理' : '已标记为已忽略')
    fetchData()
  } catch {
    MessagePlugin.error('操作失败')
  }
}

onMounted(fetchData)
</script>

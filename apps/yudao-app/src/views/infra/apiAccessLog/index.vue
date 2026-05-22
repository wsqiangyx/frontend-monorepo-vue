<template>
  <PageContainer title="API 访问日志">
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
            <t-form-item label="请求地址" name="requestUrl">
              <t-input v-model="queryParams.requestUrl" placeholder="请输入请求地址" clearable />
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
        <template #resultCode="{ row }">
          <t-tag :theme="row.resultCode === 0 ? 'success' : 'danger'">
            {{ row.resultCode === 0 ? '成功' : '失败' }}
          </t-tag>
        </template>
        <template #duration="{ row }">
          {{ row.duration }} ms
        </template>
        <template #action="{ row }">
          <t-link theme="primary" @click="handleDetail(row)">详细</t-link>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraApiAccessLog' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined as string | undefined,
  applicationName: undefined as string | undefined,
  requestUrl: undefined as string | undefined,
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
  { colKey: 'beginTime', title: '请求时间', width: 170 },
  { colKey: 'duration', title: '执行时长', width: 100 },
  { colKey: 'resultCode', title: '操作结果', width: 80 },
  { colKey: 'operateModule', title: '操作模块', width: 120 },
  { colKey: 'operateName', title: '操作名', width: 120 },
  { colKey: 'action', title: '操作', width: 80, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.userId) params.set('userId', queryParams.userId)
    if (queryParams.applicationName) params.set('applicationName', queryParams.applicationName)
    if (queryParams.requestUrl) params.set('requestUrl', queryParams.requestUrl)
    const res = await fetch(`/api/infra/api-access-log/page?${params}`)
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
  queryParams.requestUrl = undefined
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

onMounted(fetchData)
</script>

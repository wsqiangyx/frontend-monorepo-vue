<template>
  <PageContainer title="我的已办">
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
        <template #status="{ row }">
          <t-tag :theme="row.status === 2 ? 'success' : 'danger'">
            {{ row.status === 2 ? '通过' : '拒绝' }}
          </t-tag>
        </template>
        <template #processInstance="{ row }">
          <div v-if="row.processInstance">
            <div class="font-medium">{{ row.processInstance.processDefinitionName }}</div>
          </div>
        </template>
        <template #action="{ row }">
          <t-link theme="primary" @click="handleDetail(row)">详情</t-link>
        </template>
      </t-table>
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmDoneTask' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])

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
  { colKey: 'processInstance', title: '流程', width: 200 },
  { colKey: 'name', title: '任务名称', width: 150 },
  { colKey: 'status', title: '审批结果', width: 100 },
  { colKey: 'reason', title: '审批意见', ellipsis: true },
  { colKey: 'endTime', title: '完成时间', width: 170 },
  { colKey: 'action', title: '操作', width: 80, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.name) params.set('name', queryParams.name)
    const res = await fetch(`/api/bpm/task/done-page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    MessagePlugin.error('加载已办列表失败')
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

function handleDetail(row: Record<string, unknown>) {
  MessagePlugin.info('查看详情：' + row.id)
}

onMounted(fetchData)
</script>

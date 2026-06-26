<template>
  <PageContainer title="定时任务">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="100px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="任务名称" name="name">
              <t-input v-model="queryParams.name" placeholder="请输入任务名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="任务状态" name="status">
              <t-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <t-option :value="1" label="开启" />
                <t-option :value="0" label="暂停" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="处理器名称" name="handlerName">
              <t-input v-model="queryParams.handlerName" placeholder="请输入处理器名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">搜索</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
                <t-button theme="primary" @click="handleAdd">新增</t-button>
                <t-button theme="danger" :disabled="!checkedIds.length" @click="handleBatchDelete">
                  批量删除
                </t-button>
                <t-button theme="default" @click="handleJobLog">执行日志</t-button>
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
        :selected-row-keys="checkedIds"
        :pagination="pagination"
        row-key="id"
        @select-change="onSelectChange"
        @page-change="onPageChange"
      >
        <template #status="{ row }">
          <t-tag :theme="row.status === 1 ? 'success' : 'warning'">
            {{ row.status === 1 ? '运行中' : '已暂停' }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleChangeStatus(row)">
              {{ row.status === 1 ? '暂停' : '开启' }}
            </t-link>
            <t-popconfirm content="确认删除该任务？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
            <t-dropdown
              :options="[
                { content: '执行一次', value: 'run' },
                { content: '调度日志', value: 'log' },
              ]"
              @click="({ value }: { value: string }) => handleMore(value, row)"
            >
              <t-link theme="primary">更多</t-link>
            </t-dropdown>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑弹窗 -->
    <t-dialog v-model:visible="formVisible" :header="formTitle" width="600px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="120px">
        <t-form-item label="任务名称">
          <t-input v-model="formData.name" placeholder="请输入任务名称" />
        </t-form-item>
        <t-form-item label="处理器的名称">
          <t-input v-model="formData.handlerName" placeholder="请输入处理器的名称" />
        </t-form-item>
        <t-form-item label="处理器的参数">
          <t-input v-model="formData.handlerParam" placeholder="请输入处理器的参数" />
        </t-form-item>
        <t-form-item label="CRON 表达式">
          <t-input v-model="formData.cronExpression" placeholder="请输入 CRON 表达式" />
        </t-form-item>
        <t-form-item label="执行次数">
          <t-input-number v-model="formData.executeCount" :min="0" />
        </t-form-item>
        <t-form-item label="重试次数">
          <t-input-number v-model="formData.retryCount" :min="0" />
        </t-form-item>
        <t-form-item label="重试间隔">
          <t-input-number v-model="formData.retryInterval" :min="0" :step="1000" suffix="毫秒" />
        </t-form-item>
        <t-form-item label="超时时间">
          <t-input-number v-model="formData.timeout" :min="0" :step="1000" suffix="毫秒" />
        </t-form-item>
        <t-form-item label="任务状态">
          <t-radio-group v-model="formData.status">
            <t-radio :value="1">开启</t-radio>
            <t-radio :value="0">暂停</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="formData.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 调度日志弹窗 -->
    <t-dialog v-model:visible="logVisible" header="调度日志" width="900px" :footer="false">
      <t-table :data="logData" :columns="logColumns" :loading="logLoading" row-key="id" />
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraJob' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const checkedIds = ref<number[]>([])
const formVisible = ref(false)
const formTitle = ref('新增定时任务')
const formData = ref<Record<string, unknown>>({})
const logVisible = ref(false)
const logLoading = ref(false)
const logData = ref<Record<string, unknown>[]>([])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined as string | undefined,
  status: undefined as number | undefined,
  handlerName: undefined as string | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showSizeChanger: true,
})

const columns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { colKey: 'id', title: '任务编号', width: 80 },
  { colKey: 'name', title: '任务名称', ellipsis: true },
  { colKey: 'status', title: '任务状态', width: 100 },
  { colKey: 'handlerName', title: '处理器名称', width: 160 },
  { colKey: 'handlerParam', title: '处理器参数', width: 160 },
  { colKey: 'cronExpression', title: 'CRON 表达式', width: 160 },
  { colKey: 'action', title: '操作', width: 240, fixed: 'right' as const },
]

const logColumns = [
  { colKey: 'id', title: '日志编号', width: 80 },
  { colKey: 'jobId', title: '任务编号', width: 80 },
  { colKey: 'handlerName', title: '处理器名称', width: 160 },
  { colKey: 'handlerParam', title: '处理器参数', width: 160 },
  { colKey: 'status', title: '执行状态', width: 100 },
  { colKey: 'createTime', title: '执行时间', width: 170 },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.name) params.set('name', queryParams.name)
    if (queryParams.status !== undefined) params.set('status', String(queryParams.status))
    if (queryParams.handlerName) params.set('handlerName', queryParams.handlerName)
    const res = await fetch(`/api/infra/job/page?${params}`)
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
  queryParams.handlerName = undefined
  handleSearch()
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  queryParams.pageNo = pageInfo.current
  queryParams.pageSize = pageInfo.pageSize
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function onSelectChange(keys: number[]) {
  checkedIds.value = keys
}

function handleAdd() {
  formTitle.value = '新增定时任务'
  formData.value = { name: '', handlerName: '', handlerParam: '', cronExpression: '', executeCount: 0, retryCount: 3, retryInterval: 5000, timeout: 0, status: 1, remark: '' }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑定时任务'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/infra/job/update' : '/api/infra/job/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleChangeStatus(row: Record<string, unknown>) {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await fetch(`/api/infra/job/update-status?id=${row.id}&status=${newStatus}`, { method: 'PUT' })
    ElMessage.success('状态修改成功')
    fetchData()
  } catch {
    ElMessage.error('状态修改失败')
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/job/delete?id=${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

async function handleBatchDelete() {
  try {
    await fetch(`/api/infra/job/delete-list?ids=${checkedIds.value.join(',')}`, { method: 'DELETE' })
    ElMessage.success('批量删除成功')
    checkedIds.value = []
    fetchData()
  } catch {
    ElMessage.error('批量删除失败')
  }
}

async function handleMore(command: string, row: Record<string, unknown>) {
  if (command === 'run') {
    try {
      await fetch(`/api/infra/job/trigger?id=${row.id}`, { method: 'PUT' })
      ElMessage.success('执行成功')
    } catch {
      ElMessage.error('执行失败')
    }
  } else if (command === 'log') {
    await fetchJobLog(row.id as number)
  }
}

async function fetchJobLog(jobId: number) {
  logVisible.value = true
  logLoading.value = true
  try {
    const res = await fetch(`/api/infra/job-log/page?jobId=${jobId}&pageNo=1&pageSize=50`)
    const json = await res.json()
    if (json.success) logData.value = json.data.items ?? []
  } catch {
    ElMessage.error('加载日志失败')
  } finally {
    logLoading.value = false
  }
}

function handleJobLog() {
  fetchJobLog(0)
}

onMounted(fetchData)
</script>

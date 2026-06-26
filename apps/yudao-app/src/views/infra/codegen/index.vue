<template>
  <PageContainer title="代码生成">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="表名称" name="tableName">
              <t-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="表描述" name="tableComment">
              <t-input v-model="queryParams.tableComment" placeholder="请输入表描述" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">搜索</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
                <t-button theme="primary" @click="handleImport">导入</t-button>
                <t-button theme="danger" :disabled="!checkedIds.length" @click="handleBatchDelete">
                  批量删除
                </t-button>
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
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handlePreview(row)">预览</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-popconfirm content="确认删除该表定义？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
            <t-link theme="primary" @click="handleSyncDB(row)">同步</t-link>
            <t-link theme="primary" @click="handleGenCode(row)">生成代码</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 导入表弹窗 -->
    <ImportTable ref="importRef" @success="fetchData" />
    <!-- 预览代码弹窗 -->
    <PreviewCode ref="previewRef" />

    <!-- 编辑弹窗 -->
    <t-dialog v-model:visible="formVisible" header="编辑代码生成配置" width="700px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="120px">
        <t-form-item label="表名称">
          <t-input v-model="formData.tableName" disabled />
        </t-form-item>
        <t-form-item label="表描述">
          <t-input v-model="formData.tableComment" placeholder="请输入表描述" />
        </t-form-item>
        <t-form-item label="实体类名称">
          <t-input v-model="formData.className" placeholder="请输入实体类名称" />
        </t-form-item>
        <t-form-item label="作者">
          <t-input v-model="formData.author" placeholder="请输入作者" />
        </t-form-item>
        <t-form-item label="模板类型">
          <t-select v-model="formData.templateType">
            <t-option :value="1" label="单表" />
            <t-option :value="2" label="树表" />
            <t-option :value="3" label="主子表" />
          </t-select>
        </t-form-item>
        <t-form-item label="前端类型">
          <t-select v-model="formData.frontType">
            <t-option value="vue3" label="Vue3" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'
import ImportTable from './components/ImportTable.vue'
import PreviewCode from './components/PreviewCode.vue'

defineOptions({ name: 'InfraCodegen' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const checkedIds = ref<number[]>([])
const importRef = ref<InstanceType<typeof ImportTable>>()
const previewRef = ref<InstanceType<typeof PreviewCode>>()
const formVisible = ref(false)
const formData = ref<Record<string, unknown>>({})

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  tableName: undefined as string | undefined,
  tableComment: undefined as string | undefined,
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
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'tableName', title: '表名称', width: 200 },
  { colKey: 'tableComment', title: '表描述', ellipsis: true },
  { colKey: 'className', title: '实体类名', width: 180 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 280, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.tableName) params.set('tableName', queryParams.tableName)
    if (queryParams.tableComment) params.set('tableComment', queryParams.tableComment)
    const res = await fetch(`/api/infra/codegen/table/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    ElMessage.error('加载列表失败')
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
  queryParams.tableName = undefined
  queryParams.tableComment = undefined
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

function handleImport() {
  importRef.value?.open()
}

function handlePreview(row: Record<string, unknown>) {
  previewRef.value?.open(row.id as number)
}

function handleEdit(row: Record<string, unknown>) {
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    await fetch('/api/infra/codegen/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/codegen/delete?tableId=${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

async function handleBatchDelete() {
  try {
    await fetch(`/api/infra/codegen/delete-list?tableIds=${checkedIds.value.join(',')}`, { method: 'DELETE' })
    ElMessage.success('批量删除成功')
    checkedIds.value = []
    fetchData()
  } catch {
    ElMessage.error('批量删除失败')
  }
}

async function handleSyncDB(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/codegen/sync-from-db?tableId=${row.id}`, { method: 'PUT' })
    ElMessage.success('同步成功')
  } catch {
    ElMessage.error('同步失败')
  }
}

async function handleGenCode(row: Record<string, unknown>) {
  ElMessage.success('代码生成成功（Mock）')
}

onMounted(fetchData)
</script>

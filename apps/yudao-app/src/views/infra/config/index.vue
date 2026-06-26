<template>
  <PageContainer title="参数配置">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="参数名称" name="name">
              <t-input v-model="queryParams.name" placeholder="请输入参数名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="参数键名" name="key">
              <t-input v-model="queryParams.key" placeholder="请输入参数键名" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="系统内置" name="type">
              <t-select v-model="queryParams.type" placeholder="请选择" clearable>
                <t-option :value="1" label="是" />
                <t-option :value="0" label="否" />
              </t-select>
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
        <template #visible="{ row }">
          <t-tag :theme="row.visible ? 'success' : 'default'">
            {{ row.visible ? '是' : '否' }}
          </t-tag>
        </template>
        <template #type="{ row }">
          <t-tag :theme="row.type === 1 ? 'primary' : 'default'">
            {{ row.type === 1 ? '是' : '否' }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-popconfirm content="确认删除该配置？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑弹窗 -->
    <t-dialog v-model:visible="formVisible" :header="formTitle" width="600px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="参数分类">
          <t-input v-model="formData.category" placeholder="请输入参数分类" />
        </t-form-item>
        <t-form-item label="参数名称">
          <t-input v-model="formData.name" placeholder="请输入参数名称" />
        </t-form-item>
        <t-form-item label="参数键名">
          <t-input v-model="formData.key" placeholder="请输入参数键名" />
        </t-form-item>
        <t-form-item label="参数键值">
          <t-input v-model="formData.value" placeholder="请输入参数键值" />
        </t-form-item>
        <t-form-item label="系统内置">
          <t-radio-group v-model="formData.type">
            <t-radio :value="1">是</t-radio>
            <t-radio :value="0">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="是否可见">
          <t-radio-group v-model="formData.visible">
            <t-radio :value="true">是</t-radio>
            <t-radio :value="false">否</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="formData.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraConfig' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const checkedIds = ref<number[]>([])
const formVisible = ref(false)
const formTitle = ref('新增参数配置')
const formData = ref<Record<string, unknown>>({})

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined as string | undefined,
  key: undefined as string | undefined,
  type: undefined as number | undefined,
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
  { colKey: 'id', title: '参数主键', width: 80 },
  { colKey: 'category', title: '参数分类', width: 120 },
  { colKey: 'name', title: '参数名称', ellipsis: true },
  { colKey: 'key', title: '参数键名', ellipsis: true },
  { colKey: 'value', title: '参数键值', width: 150 },
  { colKey: 'visible', title: '是否可见', width: 80 },
  { colKey: 'type', title: '系统内置', width: 80 },
  { colKey: 'remark', title: '备注', ellipsis: true },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 140, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.name) params.set('name', queryParams.name)
    if (queryParams.key) params.set('key', queryParams.key)
    if (queryParams.type !== undefined) params.set('type', String(queryParams.type))
    const res = await fetch(`/api/infra/config/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    ElMessage.error('加载配置列表失败')
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
  queryParams.key = undefined
  queryParams.type = undefined
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
  formTitle.value = '新增参数配置'
  formData.value = { category: '', name: '', key: '', value: '', type: 0, visible: true, remark: '' }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑参数配置'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/infra/config/update' : '/api/infra/config/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/config/delete?id=${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

async function handleBatchDelete() {
  try {
    await fetch(`/api/infra/config/delete-list?ids=${checkedIds.value.join(',')}`, { method: 'DELETE' })
    ElMessage.success('批量删除成功')
    checkedIds.value = []
    fetchData()
  } catch {
    ElMessage.error('批量删除失败')
  }
}

onMounted(fetchData)
</script>

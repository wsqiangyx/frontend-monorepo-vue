<template>
  <PageContainer title="流程分类">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'warning'">{{ row.status === 0 ? '开启' : '关闭' }}</t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-popconfirm content="确认删除？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="formVisible" :header="formTitle" width="500px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="80px">
        <t-form-item label="分类名称">
          <t-input v-model="formData.name" placeholder="请输入分类名称" />
        </t-form-item>
        <t-form-item label="分类编码">
          <t-input v-model="formData.code" placeholder="请输入分类编码" />
        </t-form-item>
        <t-form-item label="排序">
          <t-input-number v-model="formData.sort" :min="0" />
        </t-form-item>
        <t-form-item label="状态">
          <t-radio-group v-model="formData.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmCategory' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新增流程分类')
const formData = ref<Record<string, unknown>>({ name: '', code: '', sort: 0, status: 0 })
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '分类名称' },
  { colKey: 'code', title: '分类编码', width: 150 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 140, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/bpm/category/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { ElMessage.error('加载失败') } finally { loading.value = false }
}

function handleAdd() {
  formTitle.value = '新增流程分类'
  formData.value = { name: '', code: '', sort: 0, status: 0 }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑流程分类'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/bpm/category/update' : '/api/bpm/category/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch { ElMessage.error('保存失败') }
}

async function handleDelete(row: Record<string, unknown>) {
  try { await fetch(`/api/bpm/category/delete?id=${row.id}`, { method: 'DELETE' }); ElMessage.success('删除成功'); fetchData() } catch { ElMessage.error('删除失败') }
}

onMounted(fetchData)
</script>

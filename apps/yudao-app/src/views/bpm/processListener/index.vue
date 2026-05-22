<template>
  <PageContainer title="流程监听器">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #type="{ row }">
          <t-tag>{{ row.type === 0 ? '执行监听器' : '任务监听器' }}</t-tag>
        </template>
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
        <t-form-item label="监听器名称">
          <t-input v-model="formData.name" placeholder="请输入监听器名称" />
        </t-form-item>
        <t-form-item label="类型">
          <t-select v-model="formData.type">
            <t-option :value="0" label="执行监听器" />
            <t-option :value="1" label="任务监听器" />
          </t-select>
        </t-form-item>
        <t-form-item label="执行值">
          <t-input v-model="formData.value" placeholder="请输入执行值" />
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
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmProcessListener' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新增流程监听器')
const formData = ref<Record<string, unknown>>({ name: '', type: 0, value: '', status: 0 })
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '监听器名称' },
  { colKey: 'type', title: '类型', width: 120 },
  { colKey: 'value', title: '执行值', ellipsis: true },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 140, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/bpm/process-listener/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { MessagePlugin.error('加载失败') } finally { loading.value = false }
}

function handleAdd() {
  formTitle.value = '新增流程监听器'
  formData.value = { name: '', type: 0, value: '', status: 0 }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑流程监听器'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/bpm/process-listener/update' : '/api/bpm/process-listener/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    MessagePlugin.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch { MessagePlugin.error('保存失败') }
}

async function handleDelete(row: Record<string, unknown>) {
  try { await fetch(`/api/bpm/process-listener/delete?id=${row.id}`, { method: 'DELETE' }); MessagePlugin.success('删除成功'); fetchData() } catch { MessagePlugin.error('删除失败') }
}

onMounted(fetchData)
</script>

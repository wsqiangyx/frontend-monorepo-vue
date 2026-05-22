<template>
  <PageContainer title="流程表单">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>

      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'warning'">
            {{ row.status === 0 ? '开启' : '关闭' }}
          </t-tag>
        </template>
        <template #fields="{ row }">
          <t-space v-if="row.fields">
            <t-tag v-for="field in row.fields.slice(0, 3)" :key="field" size="small">{{ field }}</t-tag>
            <t-tag v-if="row.fields.length > 3" size="small">+{{ row.fields.length - 3 }}</t-tag>
          </t-space>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-popconfirm content="确认删除该表单？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑弹窗 -->
    <t-dialog v-model:visible="formVisible" :header="formTitle" width="700px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="表单名称">
          <t-input v-model="formData.name" placeholder="请输入表单名称" />
        </t-form-item>
        <t-form-item label="状态">
          <t-radio-group v-model="formData.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="表单字段">
          <div style="width: 100%;">
            <div v-for="(field, index) in formFields" :key="index" class="mb-2">
              <t-space>
                <t-input v-model="field.title" placeholder="字段标题" style="width: 150px;" />
                <t-input v-model="field.field" placeholder="字段标识" style="width: 150px;" />
                <t-select v-model="field.type" placeholder="字段类型" style="width: 150px;">
                  <t-option value="input" label="单行文本" />
                  <t-option value="textarea" label="多行文本" />
                  <t-option value="number" label="数字" />
                  <t-option value="select" label="下拉选择" />
                  <t-option value="radio" label="单选" />
                  <t-option value="checkbox" label="多选" />
                  <t-option value="date" label="日期" />
                </t-select>
                <t-checkbox v-model="field.required">必填</t-checkbox>
                <t-button theme="danger" variant="text" @click="formFields.splice(index, 1)">删除</t-button>
              </t-space>
            </div>
            <t-button theme="default" variant="dashed" block @click="formFields.push({ title: '', field: '', type: 'input', required: false })">
              添加字段
            </t-button>
          </div>
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="formData.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'BpmForm' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新增流程表单')
const formData = ref<Record<string, unknown>>({})
const formFields = ref<Record<string, unknown>[]>([])

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '表单名称', ellipsis: true },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'fields', title: '表单字段' },
  { colKey: 'remark', title: '备注', ellipsis: true },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 140, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/bpm/form/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
    }
  } catch {
    MessagePlugin.error('加载表单列表失败')
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  formTitle.value = '新增流程表单'
  formData.value = { name: '', status: 0, remark: '' }
  formFields.value = []
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑流程表单'
  formData.value = { ...row }
  formFields.value = row.fields ? (row.fields as string[]).map((f: string) => ({ title: f, field: f, type: 'input', required: false })) : []
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const submitData = {
      ...formData.value,
      fields: formFields.value.map(f => f.title),
    }
    const method = submitData.id ? 'PUT' : 'POST'
    const url = submitData.id ? '/api/bpm/form/update' : '/api/bpm/form/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submitData) })
    MessagePlugin.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch {
    MessagePlugin.error('保存失败')
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/bpm/form/delete?id=${row.id}`, { method: 'DELETE' })
    MessagePlugin.success('删除成功')
    fetchData()
  } catch {
    MessagePlugin.error('删除失败')
  }
}

onMounted(fetchData)
</script>

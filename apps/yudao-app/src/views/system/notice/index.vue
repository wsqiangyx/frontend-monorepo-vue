<template>
  <PageContainer title="通知公告">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #type="{ row }">
          <t-tag :theme="row.type === 1 ? 'primary' : 'warning'" variant="light">
            {{ row.type === 1 ? '通知' : '公告' }}
          </t-tag>
        </template>
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'danger'" variant="light">
            {{ row.status === 0 ? '开启' : '关闭' }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-popconfirm content="确认删除该公告？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑通知公告' : '新增通知公告'" width="700px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="公告标题" name="title">
          <t-input v-model="formData.title" placeholder="请输入公告标题" />
        </t-form-item>
        <t-form-item label="公告类型" name="type">
          <t-radio-group v-model="formData.type">
            <t-radio :value="1">通知</t-radio>
            <t-radio :value="2">公告</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="内容" name="content">
          <t-textarea v-model="formData.content" placeholder="请输入公告内容" :autosize="{ minRows: 6, maxRows: 12 }" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="formData.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="dialogVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSubmit">确定</t-button>
        </t-space>
      </template>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'SystemNotice' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  title: '',
  type: 1,
  content: '',
  status: 0,
  remark: '',
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'title', title: '公告标题' },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/notice/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, title: '', type: 1, content: '', status: 0, remark: '' })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/notice/update' : '/api/system/notice/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/notice/delete?id=${row.id}`, { method: 'DELETE' })
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

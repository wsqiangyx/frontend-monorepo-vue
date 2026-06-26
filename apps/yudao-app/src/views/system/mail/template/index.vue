<template>
  <PageContainer title="邮件模板">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'danger'" variant="light">
            {{ row.status === 0 ? '开启' : '关闭' }}
          </t-tag>
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

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑邮件模板' : '新增邮件模板'" width="600px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="模板名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入模板名称" />
        </t-form-item>
        <t-form-item label="邮件标题" name="title">
          <t-input v-model="formData.title" placeholder="请输入邮件标题" />
        </t-form-item>
        <t-form-item label="邮件内容" name="content">
          <t-textarea v-model="formData.content" placeholder="请输入邮件内容 (HTML)" :autosize="{ minRows: 6 }" />
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

defineOptions({ name: 'MailTemplate' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  accountId: 1,
  nickname: '芋道系统',
  title: '',
  content: '',
  params: [] as string[],
  status: 0,
  remark: '',
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '模板名称' },
  { colKey: 'title', title: '邮件标题' },
  { colKey: 'nickname', title: '发件人名称' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/mail/template/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, name: '', accountId: 1, nickname: '芋道系统', title: '', content: '', params: [], status: 0, remark: '' })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/mail/template/update' : '/api/system/mail/template/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/mail/template/delete?id=${row.id}`, { method: 'DELETE' })
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

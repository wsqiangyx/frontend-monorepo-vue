<template>
  <PageContainer title="错误码管理">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #type="{ row }">
          <t-tag :theme="row.type === 0 ? 'primary' : 'danger'" variant="light">
            {{ row.type === 0 ? '框架' : '业务' }}
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
            <t-popconfirm content="确认删除该错误码？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑错误码' : '新增错误码'" width="600px">
      <t-form :data="formData" label-width="120px">
        <t-form-item label="错误类型" name="type">
          <t-radio-group v-model="formData.type">
            <t-radio :value="0">框架</t-radio>
            <t-radio :value="1">业务</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="应用名" name="applicationName">
          <t-input v-model="formData.applicationName" placeholder="请输入应用名" />
        </t-form-item>
        <t-form-item label="错误码" name="code">
          <t-input-number v-model="formData.code" :min="0" style="width: 100%" />
        </t-form-item>
        <t-form-item label="错误提示" name="message">
          <t-input v-model="formData.message" placeholder="请输入错误提示" />
        </t-form-item>
        <t-form-item label="备注" name="memo">
          <t-textarea v-model="formData.memo" placeholder="请输入备注" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
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
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'SystemErrorCode' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  type: 0,
  applicationName: '',
  code: 0,
  message: '',
  memo: '',
  status: 0,
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'applicationName', title: '应用名' },
  { colKey: 'code', title: '错误码', width: 130 },
  { colKey: 'message', title: '错误提示' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/error-code/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, type: 0, applicationName: '', code: 0, message: '', memo: '', status: 0 })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/error-code/update' : '/api/system/error-code/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  MessagePlugin.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/error-code/delete?id=${row.id}`, { method: 'DELETE' })
  MessagePlugin.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

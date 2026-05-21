<template>
  <PageContainer title="短信模板">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #type="{ row }">
          <t-tag :theme="row.type === 0 ? 'primary' : 'warning'" variant="light">
            {{ row.type === 0 ? '验证码' : '通知' }}
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
            <t-popconfirm content="确认删除？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑短信模板' : '新增短信模板'" width="600px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="模板类型" name="type">
          <t-radio-group v-model="formData.type">
            <t-radio :value="0">验证码</t-radio>
            <t-radio :value="1">通知</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="模板编码" name="code">
          <t-input v-model="formData.code" placeholder="请输入模板编码" />
        </t-form-item>
        <t-form-item label="模板名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入模板名称" />
        </t-form-item>
        <t-form-item label="模板内容" name="content">
          <t-textarea v-model="formData.content" placeholder="请输入模板内容，变量用 ${变量名}" />
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
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'SmsTemplate' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  type: 0,
  code: '',
  name: '',
  content: '',
  status: 0,
  remark: '',
  channelId: 1,
  channelCode: 'aliyun',
  params: [] as string[],
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'code', title: '模板编码' },
  { colKey: 'name', title: '模板名称' },
  { colKey: 'content', title: '模板内容', ellipsis: true },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/sms/template/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, type: 0, code: '', name: '', content: '', status: 0, remark: '', channelId: 1, channelCode: 'aliyun', params: [] })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/sms/template/update' : '/api/system/sms/template/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  MessagePlugin.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/sms/template/delete?id=${row.id}`, { method: 'DELETE' })
  MessagePlugin.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

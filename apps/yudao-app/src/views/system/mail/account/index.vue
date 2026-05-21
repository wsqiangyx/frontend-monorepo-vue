<template>
  <PageContainer title="邮箱账号">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #sslEnabled="{ row }">
          <t-tag :theme="row.sslEnabled ? 'success' : 'default'" variant="light">
            {{ row.sslEnabled ? '是' : '否' }}
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

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑邮箱账号' : '新增邮箱账号'" width="500px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="邮箱" name="mail">
          <t-input v-model="formData.mail" placeholder="请输入邮箱" />
        </t-form-item>
        <t-form-item label="SMTP 服务器" name="host">
          <t-input v-model="formData.host" placeholder="请输入 SMTP 服务器" />
        </t-form-item>
        <t-form-item label="端口" name="port">
          <t-input-number v-model="formData.port" :min="1" :max="65535" />
        </t-form-item>
        <t-form-item label="SSL" name="sslEnabled">
          <t-switch v-model="formData.sslEnabled" />
        </t-form-item>
        <t-form-item label="用户名" name="username">
          <t-input v-model="formData.username" placeholder="请输入用户名" />
        </t-form-item>
        <t-form-item label="密码" name="password">
          <t-input v-model="formData.password" type="password" placeholder="请输入密码" />
        </t-form-item>
        <t-form-item label="发件人名称" name="fromName">
          <t-input v-model="formData.fromName" placeholder="请输入发件人名称" />
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

defineOptions({ name: 'MailAccount' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  mail: '',
  host: '',
  port: 465,
  sslEnabled: true,
  username: '',
  password: '',
  fromName: '',
  status: 0,
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'mail', title: '邮箱' },
  { colKey: 'host', title: 'SMTP 服务器' },
  { colKey: 'port', title: '端口', width: 80 },
  { colKey: 'sslEnabled', title: 'SSL', width: 60 },
  { colKey: 'fromName', title: '发件人' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/mail/account/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, mail: '', host: '', port: 465, sslEnabled: true, username: '', password: '', fromName: '', status: 0 })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/mail/account/update' : '/api/system/mail/account/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  MessagePlugin.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/mail/account/delete?id=${row.id}`, { method: 'DELETE' })
  MessagePlugin.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

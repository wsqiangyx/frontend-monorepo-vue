<template>
  <PageContainer title="应用管理">
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

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑应用' : '新增应用'" width="600px">
      <t-form :data="formData" label-width="140px">
        <t-form-item label="应用名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入应用名称" />
        </t-form-item>
        <t-form-item label="应用编号" name="clientId">
          <t-input v-model="formData.clientId" placeholder="请输入应用编号" />
        </t-form-item>
        <t-form-item label="应用密钥" name="clientSecret">
          <t-input v-model="formData.clientSecret" placeholder="请输入应用密钥" />
        </t-form-item>
        <t-form-item label="应用图标" name="logo">
          <t-input v-model="formData.logo" placeholder="请输入图标 URL" />
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入描述" />
        </t-form-item>
        <t-form-item label="Access Token 有效期" name="accessTokenValiditySeconds">
          <t-input-number v-model="formData.accessTokenValiditySeconds" :min="60" />
        </t-form-item>
        <t-form-item label="Refresh Token 有效期" name="refreshTokenValiditySeconds">
          <t-input-number v-model="formData.refreshTokenValiditySeconds" :min="60" />
        </t-form-item>
        <t-form-item label="重定向 URI" name="redirectUris">
          <t-input v-model="formData.redirectUrisStr" placeholder="多个用逗号分隔" />
        </t-form-item>
        <t-form-item label="授权类型" name="authorizedGrantTypes">
          <t-checkbox-group v-model="formData.authorizedGrantTypes">
            <t-checkbox value="authorization_code">授权码模式</t-checkbox>
            <t-checkbox value="refresh_token">刷新令牌</t-checkbox>
            <t-checkbox value="client_credentials">客户端模式</t-checkbox>
          </t-checkbox-group>
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

defineOptions({ name: 'SystemOAuth2' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  clientId: '',
  clientKey: '',
  clientSecret: '',
  name: '',
  logo: '',
  description: '',
  status: 0,
  accessTokenValiditySeconds: 7200,
  refreshTokenValiditySeconds: 2592000,
  redirectUris: [] as string[],
  redirectUrisStr: '',
  autoApproveScopes: [] as string[],
  authorizedGrantTypes: ['authorization_code', 'refresh_token'] as string[],
  scopes: ['read', 'write'] as string[],
  authorities: [] as string[],
  resourceIds: [] as string[],
  additionalInformation: '',
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '应用名称' },
  { colKey: 'clientId', title: '应用编号' },
  { colKey: 'clientSecret', title: '应用密钥', ellipsis: true },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/oauth2/client/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, {
    id: undefined, clientId: '', clientKey: '', clientSecret: '', name: '', logo: '', description: '', status: 0,
    accessTokenValiditySeconds: 7200, refreshTokenValiditySeconds: 2592000, redirectUris: [], redirectUrisStr: '',
    autoApproveScopes: [], authorizedGrantTypes: ['authorization_code', 'refresh_token'], scopes: ['read', 'write'],
    authorities: [], resourceIds: [], additionalInformation: '',
  })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  const data = { ...row } as Record<string, unknown>
  data.redirectUrisStr = Array.isArray(data.redirectUris) ? (data.redirectUris as string[]).join(',') : ''
  Object.assign(formData, data)
  dialogVisible.value = true
}

async function handleSubmit() {
  const submitData = { ...formData, redirectUris: formData.redirectUrisStr.split(',').map((s) => s.trim()).filter(Boolean) }
  const url = isEdit.value ? '/api/system/oauth2/client/update' : '/api/system/oauth2/client/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submitData) })
  MessagePlugin.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/oauth2/client/delete?id=${row.id}`, { method: 'DELETE' })
  MessagePlugin.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

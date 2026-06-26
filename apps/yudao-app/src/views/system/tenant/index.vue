<template>
  <PageContainer title="租户管理">
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
            <t-popconfirm content="确认删除该租户？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑租户' : '新增租户'" width="600px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="租户名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入租户名称" />
        </t-form-item>
        <t-form-item label="联系人" name="contactName">
          <t-input v-model="formData.contactName" placeholder="请输入联系人" />
        </t-form-item>
        <t-form-item label="联系手机" name="contactMobile">
          <t-input v-model="formData.contactMobile" placeholder="请输入联系手机" />
        </t-form-item>
        <t-form-item label="租户套餐" name="packageId">
          <t-select v-model="formData.packageId" placeholder="请选择租户套餐">
            <t-option v-for="pkg in packages" :key="pkg.id" :value="pkg.id" :label="pkg.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="账号额度" name="accountNumber">
          <t-input-number v-model="formData.accountNumber" :min="1" />
        </t-form-item>
        <t-form-item label="过期时间" name="expireTime">
          <t-input v-model="formData.expireTime" placeholder="请输入过期时间 (YYYY-MM-DD)" />
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

defineOptions({ name: 'SystemTenant' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const packages = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)

const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  contactName: '',
  contactMobile: '',
  packageId: undefined as number | undefined,
  accountNumber: 10,
  expireTime: '',
  status: 0,
  remark: '',
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '租户名称' },
  { colKey: 'contactName', title: '联系人' },
  { colKey: 'contactMobile', title: '联系手机' },
  { colKey: 'packageName', title: '租户套餐' },
  { colKey: 'expireTime', title: '过期时间', width: 120 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 150, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/tenant/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } finally {
    loading.value = false
  }
}

async function fetchPackages() {
  const res = await fetch('/api/system/tenant-package/simple-list')
  const json = await res.json()
  if (json.success) packages.value = json.data ?? []
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, name: '', contactName: '', contactMobile: '', packageId: undefined, accountNumber: 10, expireTime: '', status: 0, remark: '' })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/tenant/update' : '/api/system/tenant/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/tenant/delete?id=${row.id}`, { method: 'DELETE' })
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchPackages()
})
</script>

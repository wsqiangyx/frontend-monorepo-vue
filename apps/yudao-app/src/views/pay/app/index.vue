<template>
  <PageContainer title="支付应用">
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
            <t-link theme="primary" @click="handleChannel(row)">渠道配置</t-link>
            <t-popconfirm content="确认删除？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="formVisible" :header="formTitle" width="600px" @confirm="handleSubmit">
      <t-form ref="formRef" :data="formData" :rules="rules" label-width="100px">
        <t-form-item label="应用名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入应用名称" />
        </t-form-item>
        <t-form-item label="应用标识" name="appKey">
          <t-input v-model="formData.appKey" placeholder="请输入应用标识" />
        </t-form-item>
        <t-form-item label="支付通知地址" name="payNotifyUrl">
          <t-input v-model="formData.payNotifyUrl" placeholder="请输入支付通知地址" />
        </t-form-item>
        <t-form-item label="退款通知地址" name="refundNotifyUrl">
          <t-input v-model="formData.refundNotifyUrl" placeholder="请输入退款通知地址" />
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
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'PayApp' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新增支付应用')
const formRef = ref()
const formData = ref<Record<string, unknown>>({ name: '', appKey: '', payNotifyUrl: '', refundNotifyUrl: '', status: 0, remark: '' })
const rules = { name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }] }
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '应用名称' },
  { colKey: 'appKey', title: '应用标识' },
  { colKey: 'merchantName', title: '商户名称' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 200, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/pay/app/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { ElMessage.error('加载失败') } finally { loading.value = false }
}

function handleAdd() {
  formTitle.value = '新增支付应用'
  formData.value = { name: '', appKey: '', payNotifyUrl: '', refundNotifyUrl: '', status: 0, remark: '' }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑支付应用'
  formData.value = { ...row }
  formVisible.value = true
}

function handleChannel(row: Record<string, unknown>) {
  ElMessage.info('渠道配置功能：' + row.id)
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/pay/app/update' : '/api/pay/app/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch { ElMessage.error('保存失败') }
}

async function handleDelete(row: Record<string, unknown>) {
  try { await fetch(`/api/pay/app/delete?id=${row.id}`, { method: 'DELETE' }); ElMessage.success('删除成功'); fetchData() } catch { ElMessage.error('删除失败') }
}

onMounted(fetchData)
</script>

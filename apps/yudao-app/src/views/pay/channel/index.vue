<template>
  <PageContainer title="支付渠道">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id">
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'warning'">{{ row.status === 0 ? '开启' : '关闭' }}</t-tag>
        </template>
        <template #feeRate="{ row }">
          {{ row.feeRate }}%
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

    <t-dialog v-model:visible="formVisible" :header="formTitle" width="600px" @confirm="handleSubmit">
      <t-form ref="formRef" :data="formData" label-width="100px">
        <t-form-item label="渠道编码" name="code">
          <t-select v-model="formData.code" placeholder="请选择支付渠道">
            <t-option value="alipay" label="支付宝" />
            <t-option value="wxpay" label="微信支付" />
            <t-option value="mock" label="模拟支付" />
          </t-select>
        </t-form-item>
        <t-form-item label="费率(%)" name="feeRate">
          <t-input-number v-model="formData.feeRate" :min="0" :max="100" :decimal-places="2" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="formData.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="formData.remark" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'PayChannel' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新增支付渠道')
const formData = ref<Record<string, unknown>>({ code: '', feeRate: 0.6, status: 0, remark: '' })
const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'code', title: '渠道编码' },
  { colKey: 'remark', title: '渠道名称' },
  { colKey: 'feeRate', title: '费率', width: 100 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 140, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/pay/channel/page?pageNo=1&pageSize=50')
    const json = await res.json()
    if (json.success) tableData.value = json.data.items ?? []
  } catch { MessagePlugin.error('加载失败') } finally { loading.value = false }
}

function handleAdd() {
  formTitle.value = '新增支付渠道'
  formData.value = { code: '', feeRate: 0.6, status: 0, remark: '' }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑支付渠道'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/pay/channel/update' : '/api/pay/channel/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    MessagePlugin.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch { MessagePlugin.error('保存失败') }
}

async function handleDelete(row: Record<string, unknown>) {
  try { await fetch(`/api/pay/channel/delete?id=${row.id}`, { method: 'DELETE' }); MessagePlugin.success('删除成功'); fetchData() } catch { MessagePlugin.error('删除失败') }
}

onMounted(fetchData)
</script>

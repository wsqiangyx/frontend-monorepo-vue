<template>
  <PageContainer title="部门管理">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id" :tree="treeConfig">
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'danger'" variant="light">
            {{ row.status === 0 ? '开启' : '关闭' }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleAddChild(row)">新增</t-link>
            <t-popconfirm content="确认删除该部门？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑部门' : '新增部门'" width="500px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="部门名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入部门名称" />
        </t-form-item>
        <t-form-item label="显示排序" name="sort">
          <t-input-number v-model="formData.sort" :min="0" />
        </t-form-item>
        <t-form-item label="负责人" name="leaderUserId">
          <t-input v-model="formData.leaderUserId" placeholder="请输入负责人" />
        </t-form-item>
        <t-form-item label="联系电话" name="phone">
          <t-input v-model="formData.phone" placeholder="请输入联系电话" />
        </t-form-item>
        <t-form-item label="邮箱" name="email">
          <t-input v-model="formData.email" placeholder="请输入邮箱" />
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
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'SystemDept' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const treeConfig = { childrenKey: 'children' }

const formData = reactive({
  id: undefined as number | undefined,
  parentId: 0,
  name: '',
  sort: 0,
  leaderUserId: undefined as number | undefined,
  phone: '',
  email: '',
  status: 0,
})

const columns = [
  { colKey: 'name', title: '部门名称', width: 200 },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'phone', title: '联系电话' },
  { colKey: 'email', title: '邮箱' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 200, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/dept/list')
    const json = await res.json()
    if (json.success) tableData.value = json.data ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, parentId: 0, name: '', sort: 0, leaderUserId: undefined, phone: '', email: '', status: 0 })
  dialogVisible.value = true
}

function handleAddChild(row: Record<string, unknown>) {
  isEdit.value = false
  Object.assign(formData, { id: undefined, parentId: row.id, name: '', sort: 0, leaderUserId: undefined, phone: '', email: '', status: 0 })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/dept/update' : '/api/system/dept/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/dept/delete?id=${row.id}`, { method: 'DELETE' })
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

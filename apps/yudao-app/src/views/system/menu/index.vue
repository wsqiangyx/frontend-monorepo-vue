<template>
  <PageContainer title="菜单管理">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>
      <t-table :data="tableData" :columns="columns" :loading="loading" row-key="id" :tree="treeConfig">
        <template #type="{ row }">
          <t-tag v-if="row.type === 1" theme="primary">目录</t-tag>
          <t-tag v-else-if="row.type === 2" theme="success">菜单</t-tag>
          <t-tag v-else theme="warning">按钮</t-tag>
        </template>
        <template #status="{ row }">
          <t-tag :theme="row.status === 0 ? 'success' : 'danger'" variant="light">
            {{ row.status === 0 ? '开启' : '关闭' }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleAddChild(row)">新增</t-link>
            <t-popconfirm content="确认删除该菜单？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <t-dialog v-model:visible="dialogVisible" :header="isEdit ? '编辑菜单' : '新增菜单'" width="600px">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="菜单类型" name="type">
          <t-radio-group v-model="formData.type">
            <t-radio :value="1">目录</t-radio>
            <t-radio :value="2">菜单</t-radio>
            <t-radio :value="3">按钮</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="菜单名称" name="name">
          <t-input v-model="formData.name" placeholder="请输入菜单名称" />
        </t-form-item>
        <t-form-item v-if="formData.type !== 3" label="路由地址" name="path">
          <t-input v-model="formData.path" placeholder="请输入路由地址" />
        </t-form-item>
        <t-form-item v-if="formData.type === 2" label="组件路径" name="component">
          <t-input v-model="formData.component" placeholder="请输入组件路径" />
        </t-form-item>
        <t-form-item v-if="formData.type !== 1" label="权限标识" name="permission">
          <t-input v-model="formData.permission" placeholder="请输入权限标识" />
        </t-form-item>
        <t-form-item label="显示排序" name="sort">
          <t-input-number v-model="formData.sort" :min="0" />
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

defineOptions({ name: 'SystemMenu' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const treeConfig = { childrenKey: 'children' }

const formData = reactive({
  id: undefined as number | undefined,
  parentId: 0,
  type: 2,
  name: '',
  path: '',
  component: '',
  permission: '',
  sort: 0,
  status: 0,
})

const columns = [
  { colKey: 'name', title: '菜单名称', width: 200 },
  { colKey: 'type', title: '类型', width: 80 },
  { colKey: 'path', title: '路由地址' },
  { colKey: 'component', title: '组件路径' },
  { colKey: 'permission', title: '权限标识' },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'action', title: '操作', width: 200, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const res = await fetch('/api/system/menu/list')
    const json = await res.json()
    if (json.success) tableData.value = json.data ?? []
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  isEdit.value = false
  Object.assign(formData, { id: undefined, parentId: 0, type: 2, name: '', path: '', component: '', permission: '', sort: 0, status: 0 })
  dialogVisible.value = true
}

function handleAddChild(row: Record<string, unknown>) {
  isEdit.value = false
  Object.assign(formData, { id: undefined, parentId: row.id, type: 2, name: '', path: '', component: '', permission: '', sort: 0, status: 0 })
  dialogVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

async function handleSubmit() {
  const url = isEdit.value ? '/api/system/menu/update' : '/api/system/menu/create'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
  fetchData()
}

async function handleDelete(row: Record<string, unknown>) {
  await fetch(`/api/system/menu/delete?id=${row.id}`, { method: 'DELETE' })
  ElMessage.success('删除成功')
  fetchData()
}

onMounted(fetchData)
</script>

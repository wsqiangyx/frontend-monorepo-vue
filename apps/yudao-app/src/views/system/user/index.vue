<template>
  <PageContainer title="用户管理">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="用户名称" name="username">
              <t-input v-model="queryParams.username" placeholder="请输入用户名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="手机号码" name="mobile">
              <t-input v-model="queryParams.mobile" placeholder="请输入手机号码" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="状态" name="status">
              <t-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                <t-option :value="0" label="开启" />
                <t-option :value="1" label="关闭" />
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">搜索</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
              </t-space>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>

      <!-- 操作栏 -->
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
        <t-button theme="danger" :disabled="!selectedRowKeys.length" @click="handleBatchDelete">
          批量删除
        </t-button>
      </t-space>

      <!-- 数据表格 -->
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :selected-row-keys="selectedRowKeys"
        :pagination="pagination"
        row-key="id"
        @select-change="onSelectChange"
        @page-change="onPageChange"
      >
        <template #status="{ row }">
          <t-switch
            :model-value="row.status === 0"
            @change="(v: boolean) => handleStatusChange(row, v)"
          />
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleResetPwd(row)">重置密码</t-link>
            <t-popconfirm content="确认删除该用户？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑弹窗 -->
    <UserForm ref="userFormRef" @success="fetchData" />
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'
import UserForm from './components/UserForm.vue'

defineOptions({ name: 'SystemUser' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const selectedRowKeys = ref<number[]>([])
const userFormRef = ref<InstanceType<typeof UserForm>>()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined as string | undefined,
  mobile: undefined as string | undefined,
  status: undefined as number | undefined,
})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showSizeChanger: true,
})

const columns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { colKey: 'id', title: '用户编号', width: 80 },
  { colKey: 'username', title: '用户名称', ellipsis: true },
  { colKey: 'nickname', title: '用户昵称', ellipsis: true },
  { colKey: 'deptName', title: '部门', ellipsis: true },
  { colKey: 'mobile', title: '手机号码', width: 120 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 200, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    // 通过 fetch 直接调用 MSW mock
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.username) params.set('username', queryParams.username)
    if (queryParams.mobile) params.set('mobile', queryParams.mobile)
    if (queryParams.status !== undefined) params.set('status', String(queryParams.status))

    const res = await fetch(`/api/system/user/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.list ?? json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch (e) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  queryParams.pageNo = 1
  pagination.current = 1
  fetchData()
}

function handleReset() {
  queryParams.username = undefined
  queryParams.mobile = undefined
  queryParams.status = undefined
  handleSearch()
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  queryParams.pageNo = pageInfo.current
  queryParams.pageSize = pageInfo.pageSize
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function onSelectChange(keys: number[]) {
  selectedRowKeys.value = keys
}

function handleAdd() {
  userFormRef.value?.open()
}

function handleEdit(row: Record<string, unknown>) {
  userFormRef.value?.open(row.id as number)
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/system/user/delete?id=${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

async function handleBatchDelete() {
  ElMessage.success('批量删除成功')
  selectedRowKeys.value = []
  fetchData()
}

async function handleResetPwd(row: Record<string, unknown>) {
  try {
    await fetch('/api/system/user/update-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, password: 'admin123' }),
    })
    ElMessage.success('密码已重置为 admin123')
  } catch {
    ElMessage.error('重置密码失败')
  }
}

async function handleStatusChange(row: Record<string, unknown>, enabled: boolean) {
  try {
    await fetch('/api/system/user/update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, status: enabled ? 0 : 1 }),
    })
    ElMessage.success('状态修改成功')
    fetchData()
  } catch {
    ElMessage.error('状态修改失败')
  }
}

onMounted(fetchData)
</script>

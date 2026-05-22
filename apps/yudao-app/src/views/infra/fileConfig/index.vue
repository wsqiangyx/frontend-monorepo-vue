<template>
  <PageContainer title="文件配置">
    <t-card>
      <t-space class="mb-4">
        <t-button theme="primary" @click="handleAdd">新增</t-button>
      </t-space>

      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @page-change="onPageChange"
      >
        <template #master="{ row }">
          <t-tag :theme="row.master ? 'success' : 'default'">
            {{ row.master ? '是' : '否' }}
          </t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleSetMaster(row)">设为主配置</t-link>
            <t-popconfirm content="确认删除该配置？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑弹窗 -->
    <t-dialog v-model:visible="formVisible" :header="formTitle" width="600px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="配置名">
          <t-input v-model="formData.name" placeholder="请输入配置名" />
        </t-form-item>
        <t-form-item label="存储器">
          <t-select v-model="formData.storage" placeholder="请选择存储器">
            <t-option value="db" label="数据库" />
            <t-option value="local" label="本地磁盘" />
            <t-option value="s3" label="S3 对象存储" />
          </t-select>
        </t-form-item>
        <t-form-item label="基础路径">
          <t-input v-model="formData.basePath" placeholder="请输入基础路径" />
        </t-form-item>
        <t-form-item label="备注">
          <t-textarea v-model="formData.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraFileConfig' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新增文件配置')
const formData = ref<Record<string, unknown>>({})

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
  showSizeChanger: true,
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '配置名', ellipsis: true },
  { colKey: 'storage', title: '存储器', width: 120 },
  { colKey: 'master', title: '主配置', width: 80 },
  { colKey: 'remark', title: '备注', ellipsis: true },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 200, fixed: 'right' as const },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(pagination.current))
    params.set('pageSize', String(pagination.pageSize))
    const res = await fetch(`/api/infra/file-config/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    MessagePlugin.error('加载配置列表失败')
  } finally {
    loading.value = false
  }
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  fetchData()
}

function handleAdd() {
  formTitle.value = '新增文件配置'
  formData.value = { name: '', storage: 'db', basePath: '', remark: '' }
  formVisible.value = true
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑文件配置'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/infra/file-config/update' : '/api/infra/file-config/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    MessagePlugin.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch {
    MessagePlugin.error('保存失败')
  }
}

async function handleSetMaster(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/file-config/update-master?id=${row.id}`, { method: 'PUT' })
    MessagePlugin.success('设置成功')
    fetchData()
  } catch {
    MessagePlugin.error('设置失败')
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/file-config/delete?id=${row.id}`, { method: 'DELETE' })
    MessagePlugin.success('删除成功')
    fetchData()
  } catch {
    MessagePlugin.error('删除失败')
  }
}

onMounted(fetchData)
</script>

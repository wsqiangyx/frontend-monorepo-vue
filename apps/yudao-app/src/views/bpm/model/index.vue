<template>
  <PageContainer title="流程模型">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="68px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="8">
            <t-form-item label="模型名称" name="name">
              <t-input v-model="queryParams.name" placeholder="请输入模型名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">搜索</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
                <t-button theme="primary" @click="handleAdd">新建模型</t-button>
              </t-space>
            </t-form-item>
          </t-col>
        </t-row>
      </t-form>

      <!-- 数据表格 -->
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        row-key="id"
      >
        <template #status="{ row }">
          <t-tag :theme="row.status === 1 ? 'success' : 'warning'">
            {{ row.status === 1 ? '已激活' : '未激活' }}
          </t-tag>
        </template>
        <template #processDefinition="{ row }">
          <span v-if="row.processDefinition">
            v{{ row.processDefinition.version }} - {{ row.processDefinition.deploymentTime }}
          </span>
          <t-tag v-else theme="default">未部署</t-tag>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleDesign(row)">设计</t-link>
            <t-link theme="primary" @click="handleDeploy(row)">部署</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-popconfirm content="确认删除该模型？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 新增/编辑弹窗 -->
    <t-dialog v-model:visible="formVisible" :header="formTitle" width="600px" @confirm="handleSubmit">
      <t-form :data="formData" label-width="100px">
        <t-form-item label="模型名称">
          <t-input v-model="formData.name" placeholder="请输入模型名称" />
        </t-form-item>
        <t-form-item label="模型标识">
          <t-input v-model="formData.key" placeholder="请输入模型标识（英文）" />
        </t-form-item>
        <t-form-item label="流程分类">
          <t-select v-model="formData.categoryId" placeholder="请选择流程分类" clearable>
            <t-option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id" :label="cat.name" />
          </t-select>
        </t-form-item>
        <t-form-item label="描述">
          <t-textarea v-model="formData.description" placeholder="请输入描述" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- BPMN 设计器弹窗 -->
    <t-dialog v-model:visible="designerVisible" header="流程设计器" width="90%" :footer="false">
      <div style="height: 600px;">
        <BpmnProcessDesigner :xml="designerXml" :height="580" @saved="onDesignerSaved" />
      </div>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'
import { BpmnProcessDesigner } from '@repo/shared-workflow'

defineOptions({ name: 'BpmModel' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const formVisible = ref(false)
const formTitle = ref('新建模型')
const formData = ref<Record<string, unknown>>({})
const designerVisible = ref(false)
const designerXml = ref('')
const designModelId = ref<number | null>(null)
const categoryOptions = ref<Record<string, unknown>[]>([])

const queryParams = reactive({
  name: undefined as string | undefined,
})

const columns = [
  { colKey: 'id', title: '编号', width: 80 },
  { colKey: 'name', title: '模型名称', ellipsis: true },
  { colKey: 'key', title: '模型标识', width: 150 },
  { colKey: 'categoryName', title: '流程分类', width: 120 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'processDefinition', title: '流程定义', width: 200 },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 260, fixed: 'right' as const },
]

async function fetchCategories() {
  try {
    const res = await fetch('/api/bpm/category/simple-list')
    const json = await res.json()
    if (json.success) categoryOptions.value = json.data ?? []
  } catch { /* ignore */ }
}

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (queryParams.name) params.set('name', queryParams.name)
    const res = await fetch(`/api/bpm/model/list?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data ?? []
    }
  } catch {
    ElMessage.error('加载模型列表失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchData()
}

function handleReset() {
  queryParams.name = undefined
  fetchData()
}

function handleAdd() {
  formTitle.value = '新建模型'
  formData.value = { name: '', key: '', categoryId: undefined, description: '' }
  formVisible.value = true
}

function handleDesign(row: Record<string, unknown>) {
  designModelId.value = row.id as number
  designerXml.value = (row.bpmnXml as string) ?? ''
  designerVisible.value = true
}

async function onDesignerSaved(xml: string) {
  if (!designModelId.value) return
  try {
    await fetch('/api/bpm/model/update-bpmn', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: designModelId.value, bpmnXml: xml }),
    })
    ElMessage.success('保存成功')
    designerVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDeploy(row: Record<string, unknown>) {
  try {
    await fetch(`/api/bpm/model/deploy?id=${row.id}`, { method: 'POST' })
    ElMessage.success('部署成功')
    fetchData()
  } catch {
    ElMessage.error('部署失败')
  }
}

function handleEdit(row: Record<string, unknown>) {
  formTitle.value = '编辑模型'
  formData.value = { ...row }
  formVisible.value = true
}

async function handleSubmit() {
  try {
    const method = formData.value.id ? 'PUT' : 'POST'
    const url = formData.value.id ? '/api/bpm/model/update' : '/api/bpm/model/create'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData.value) })
    ElMessage.success('保存成功')
    formVisible.value = false
    fetchData()
  } catch {
    ElMessage.error('保存失败')
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/bpm/model/delete?id=${row.id}`, { method: 'DELETE' })
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  fetchCategories()
  fetchData()
})
</script>

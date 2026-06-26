<template>
  <PageContainer title="数据库文档">
    <t-card>
      <t-alert theme="info" class="mb-4">
        数据库文档基于数据库表结构自动生成，可查看表结构、字段说明等信息。
      </t-alert>

      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="表名称" name="tableName">
              <t-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable />
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

      <!-- 数据表格 -->
      <t-table
        :data="tableData"
        :columns="columns"
        :loading="loading"
        row-key="name"
      >
        <template #action="{ row }">
          <t-link theme="primary" @click="handleDetail(row)">查看字段</t-link>
        </template>
      </t-table>
    </t-card>

    <!-- 字段详情弹窗 -->
    <t-dialog v-model:visible="detailVisible" :header="detailTitle" width="900px" :footer="false">
      <t-table :data="columnData" :columns="columnColumns" row-key="name" />
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraDbDoc' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const detailVisible = ref(false)
const detailTitle = ref('')
const columnData = ref<Record<string, unknown>[]>([])

const queryParams = reactive({
  tableName: undefined as string | undefined,
})

const columns = [
  { colKey: 'name', title: '表名称', width: 250 },
  { colKey: 'comment', title: '表注释', ellipsis: true },
  { colKey: 'createTime', title: '创建时间', width: 170 },
  { colKey: 'action', title: '操作', width: 120, fixed: 'right' as const },
]

const columnColumns = [
  { colKey: 'name', title: '字段名称', width: 180 },
  { colKey: 'type', title: '字段类型', width: 150 },
  { colKey: 'comment', title: '字段注释', ellipsis: true },
  { colKey: 'nullable', title: '允许空值', width: 80 },
  { colKey: 'defaultValue', title: '默认值', width: 120 },
]

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (queryParams.tableName) params.set('name', queryParams.tableName)
    const res = await fetch(`/api/infra/db-doc/list?${params}`)
    const json = await res.json()
    if (json.success) tableData.value = json.data ?? []
  } catch {
    ElMessage.error('加载数据库文档失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchData()
}

function handleReset() {
  queryParams.tableName = undefined
  fetchData()
}

function handleDetail(row: Record<string, unknown>) {
  detailTitle.value = `${row.name}（${row.comment}）- 字段列表`
  columnData.value = (row.columns as Record<string, unknown>[]) ?? []
  detailVisible.value = true
}

onMounted(fetchData)
</script>

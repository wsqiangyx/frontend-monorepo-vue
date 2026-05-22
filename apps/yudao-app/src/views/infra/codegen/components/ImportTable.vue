<template>
  <t-dialog v-model:visible="visible" header="导入表" :width="800" :footer="false">
    <!-- 搜索栏 -->
    <t-form :data="queryParams" label-width="68px" class="mb-4">
      <t-row :gutter="16">
        <t-col :span="8">
          <t-form-item label="表名称" name="name">
            <t-input v-model="queryParams.name" placeholder="请输入表名称" clearable />
          </t-form-item>
        </t-col>
        <t-col :span="8">
          <t-form-item label="表描述" name="comment">
            <t-input v-model="queryParams.comment" placeholder="请输入表描述" clearable />
          </t-form-item>
        </t-col>
        <t-col :span="8">
          <t-form-item>
            <t-space>
              <t-button theme="primary" size="small" @click="fetchList">搜索</t-button>
              <t-button theme="default" size="small" @click="handleReset">重置</t-button>
            </t-space>
          </t-form-item>
        </t-col>
      </t-row>
    </t-form>

    <!-- 表列表 -->
    <t-table
      ref="tableRef"
      :data="dbTableList"
      :columns="tableColumns"
      :loading="dbTableLoading"
      :selected-row-keys="selectedNames"
      :height="260"
      row-key="name"
      @select-change="onSelectionChange"
    />

    <!-- 操作按钮 -->
    <div class="mt-4 text-right">
      <t-space>
        <t-button theme="primary" :disabled="!selectedNames.length || dbTableLoading" @click="handleImport">
          导入
        </t-button>
        <t-button theme="default" @click="close">关闭</t-button>
      </t-space>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'

const emit = defineEmits<{ success: [] }>()

const visible = ref(false)
const dbTableLoading = ref(false)
const dbTableList = ref<Array<{ name: string; comment: string }>>([])
const selectedNames = ref<string[]>([])

const queryParams = reactive({
  name: undefined as string | undefined,
  comment: undefined as string | undefined,
})

const tableColumns = [
  { colKey: 'row-select', type: 'multiple', width: 50 },
  { colKey: 'name', title: '表名称' },
  { colKey: 'comment', title: '表描述' },
]

async function fetchList() {
  dbTableLoading.value = true
  try {
    const params = new URLSearchParams()
    if (queryParams.name) params.set('name', queryParams.name)
    if (queryParams.comment) params.set('comment', queryParams.comment)
    const res = await fetch(`/api/infra/codegen/db/table/list?${params}`)
    const json = await res.json()
    if (json.success) {
      dbTableList.value = json.data ?? []
    }
  } catch {
    MessagePlugin.error('加载表列表失败')
  } finally {
    dbTableLoading.value = false
  }
}

function handleReset() {
  queryParams.name = undefined
  queryParams.comment = undefined
  fetchList()
}

function onSelectionChange(keys: string[]) {
  selectedNames.value = keys
}

async function open() {
  visible.value = true
  selectedNames.value = []
  await fetchList()
}

function close() {
  visible.value = false
  selectedNames.value = []
}

async function handleImport() {
  dbTableLoading.value = true
  try {
    await fetch('/api/infra/codegen/create-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataSourceConfigId: 0, tableNames: selectedNames.value }),
    })
    MessagePlugin.success('导入成功')
    emit('success')
    close()
  } catch {
    MessagePlugin.error('导入失败')
  } finally {
    dbTableLoading.value = false
  }
}

defineExpose({ open })
</script>

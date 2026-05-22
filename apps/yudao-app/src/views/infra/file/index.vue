<template>
  <PageContainer title="文件管理">
    <t-card>
      <!-- 搜索栏 -->
      <t-form :data="queryParams" label-width="80px" class="mb-4">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item label="文件路径" name="path">
              <t-input v-model="queryParams.path" placeholder="请输入文件路径" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="文件类型" name="type">
              <t-input v-model="queryParams.type" placeholder="请输入文件类型" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item>
              <t-space>
                <t-button theme="primary" @click="handleSearch">搜索</t-button>
                <t-button theme="default" @click="handleReset">重置</t-button>
                <t-button theme="primary" @click="handleUpload">上传文件</t-button>
                <t-button theme="danger" :disabled="!checkedIds.length" @click="handleBatchDelete">
                  批量删除
                </t-button>
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
        :selected-row-keys="checkedIds"
        :pagination="pagination"
        row-key="id"
        @select-change="onSelectChange"
        @page-change="onPageChange"
      >
        <template #size="{ row }">
          {{ formatFileSize(row.size) }}
        </template>
        <template #url="{ row }">
          <t-link v-if="row.type?.includes('image')" theme="primary" :href="row.url" target="_blank">
            预览
          </t-link>
          <t-link v-else theme="primary" :href="row.url" target="_blank">
            下载
          </t-link>
        </template>
        <template #action="{ row }">
          <t-space>
            <t-link theme="primary" @click="copyUrl(row.url)">复制链接</t-link>
            <t-popconfirm content="确认删除该文件？" @confirm="handleDelete(row)">
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>

    <!-- 上传文件弹窗 -->
    <t-dialog v-model:visible="uploadVisible" header="上传文件" width="500px" :footer="false">
      <t-upload
        v-model="uploadFiles"
        action="/api/infra/file/upload"
        :auto-upload="false"
        :multiple="true"
        :max="10"
        theme="file"
        placeholder="请选择文件"
        @change="onUploadChange"
      />
      <t-space class="mt-4" justify="end">
        <t-button theme="default" @click="uploadVisible = false">取消</t-button>
        <t-button theme="primary" :loading="uploading" @click="doUpload">开始上传</t-button>
      </t-space>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraFile' })

const loading = ref(false)
const tableData = ref<Record<string, unknown>[]>([])
const checkedIds = ref<number[]>([])
const uploadVisible = ref(false)
const uploading = ref(false)
const uploadFiles = ref([])

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  path: undefined as string | undefined,
  type: undefined as string | undefined,
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
  { colKey: 'name', title: '文件名', ellipsis: true },
  { colKey: 'path', title: '文件路径', ellipsis: true },
  { colKey: 'size', title: '文件大小', width: 120 },
  { colKey: 'type', title: '文件类型', width: 180 },
  { colKey: 'url', title: '文件内容', width: 110 },
  { colKey: 'createTime', title: '上传时间', width: 170 },
  { colKey: 'action', title: '操作', width: 160, fixed: 'right' as const },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

async function fetchData() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('pageNo', String(queryParams.pageNo))
    params.set('pageSize', String(queryParams.pageSize))
    if (queryParams.path) params.set('path', queryParams.path)
    if (queryParams.type) params.set('type', queryParams.type)
    const res = await fetch(`/api/infra/file/page?${params}`)
    const json = await res.json()
    if (json.success) {
      tableData.value = json.data.items ?? []
      pagination.total = json.data.total ?? 0
    }
  } catch {
    MessagePlugin.error('加载文件列表失败')
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
  queryParams.path = undefined
  queryParams.type = undefined
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
  checkedIds.value = keys
}

function handleUpload() {
  uploadFiles.value = []
  uploadVisible.value = true
}

function onUploadChange({ files }: { files: File[] }) {
  uploadFiles.value = files as any
}

async function doUpload() {
  uploading.value = true
  try {
    for (const file of uploadFiles.value as any[]) {
      const formData = new FormData()
      formData.append('file', file.raw ?? file)
      await fetch('/api/infra/file/upload', { method: 'POST', body: formData })
    }
    MessagePlugin.success('上传成功')
    uploadVisible.value = false
    fetchData()
  } catch {
    MessagePlugin.error('上传失败')
  } finally {
    uploading.value = false
  }
}

async function handleDelete(row: Record<string, unknown>) {
  try {
    await fetch(`/api/infra/file/delete?id=${row.id}`, { method: 'DELETE' })
    MessagePlugin.success('删除成功')
    fetchData()
  } catch {
    MessagePlugin.error('删除失败')
  }
}

async function handleBatchDelete() {
  try {
    await fetch(`/api/infra/file/delete-list?ids=${checkedIds.value.join(',')}`, { method: 'DELETE' })
    MessagePlugin.success('批量删除成功')
    checkedIds.value = []
    fetchData()
  } catch {
    MessagePlugin.error('批量删除失败')
  }
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    MessagePlugin.success('复制成功')
  } catch {
    MessagePlugin.error('复制失败')
  }
}

onMounted(fetchData)
</script>

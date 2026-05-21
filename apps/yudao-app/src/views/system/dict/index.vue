<template>
  <PageContainer title="字典管理">
    <t-row :gutter="16">
      <!-- 字典类型列表 -->
      <t-col :span="10">
        <t-card title="字典类型" class="mb-4">
          <template #actions>
            <t-button theme="primary" size="small" @click="handleAddType">新增</t-button>
          </template>
          <t-table
            :data="dictTypes"
            :columns="typeColumns"
            :loading="typeLoading"
            row-key="id"
            @row-click="onTypeClick"
          >
            <template #status="{ row }">
              <t-tag :theme="row.status === 0 ? 'success' : 'danger'" variant="light">
                {{ row.status === 0 ? '开启' : '关闭' }}
              </t-tag>
            </template>
            <template #action="{ row }">
              <t-space>
                <t-link theme="primary" @click.stop="handleEditType(row)">编辑</t-link>
                <t-popconfirm content="确认删除？" @confirm="handleDeleteType(row)">
                  <t-link theme="danger" @click.stop>删除</t-link>
                </t-popconfirm>
              </t-space>
            </template>
          </t-table>
        </t-card>
      </t-col>

      <!-- 字典数据列表 -->
      <t-col :span="14">
        <t-card :title="`字典数据 - ${selectedType?.name ?? '请选择'}`">
          <template #actions>
            <t-button theme="primary" size="small" :disabled="!selectedType" @click="handleAddData">新增</t-button>
          </template>
          <t-table :data="dictData" :columns="dataColumns" :loading="dataLoading" row-key="id">
            <template #status="{ row }">
              <t-tag :theme="row.status === 0 ? 'success' : 'danger'" variant="light">
                {{ row.status === 0 ? '开启' : '关闭' }}
              </t-tag>
            </template>
            <template #action="{ row }">
              <t-space>
                <t-link theme="primary" @click="handleEditData(row)">编辑</t-link>
                <t-popconfirm content="确认删除？" @confirm="handleDeleteData(row)">
                  <t-link theme="danger">删除</t-link>
                </t-popconfirm>
              </t-space>
            </template>
          </t-table>
        </t-card>
      </t-col>
    </t-row>

    <!-- 字典类型弹窗 -->
    <t-dialog v-model:visible="typeDialogVisible" :header="isEditType ? '编辑字典类型' : '新增字典类型'" width="500px">
      <t-form :data="typeForm" label-width="100px">
        <t-form-item label="字典名称" name="name">
          <t-input v-model="typeForm.name" placeholder="请输入字典名称" />
        </t-form-item>
        <t-form-item label="字典类型" name="type">
          <t-input v-model="typeForm.type" placeholder="请输入字典类型" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="typeForm.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="typeForm.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="typeDialogVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSubmitType">确定</t-button>
        </t-space>
      </template>
    </t-dialog>

    <!-- 字典数据弹窗 -->
    <t-dialog v-model:visible="dataDialogVisible" :header="isEditData ? '编辑字典数据' : '新增字典数据'" width="500px">
      <t-form :data="dataForm" label-width="100px">
        <t-form-item label="字典标签" name="label">
          <t-input v-model="dataForm.label" placeholder="请输入字典标签" />
        </t-form-item>
        <t-form-item label="字典值" name="value">
          <t-input v-model="dataForm.value" placeholder="请输入字典值" />
        </t-form-item>
        <t-form-item label="显示排序" name="sort">
          <t-input-number v-model="dataForm.sort" :min="0" />
        </t-form-item>
        <t-form-item label="状态" name="status">
          <t-radio-group v-model="dataForm.status">
            <t-radio :value="0">开启</t-radio>
            <t-radio :value="1">关闭</t-radio>
          </t-radio-group>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-textarea v-model="dataForm.remark" placeholder="请输入备注" />
        </t-form-item>
      </t-form>
      <template #footer>
        <t-space>
          <t-button theme="default" @click="dataDialogVisible = false">取消</t-button>
          <t-button theme="primary" @click="handleSubmitData">确定</t-button>
        </t-space>
      </template>
    </t-dialog>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'SystemDict' })

const typeLoading = ref(false)
const dataLoading = ref(false)
const dictTypes = ref<Record<string, unknown>[]>([])
const dictData = ref<Record<string, unknown>[]>([])
const selectedType = ref<Record<string, unknown> | null>(null)

const typeDialogVisible = ref(false)
const isEditType = ref(false)
const typeForm = reactive({ id: undefined as number | undefined, name: '', type: '', status: 0, remark: '' })

const dataDialogVisible = ref(false)
const isEditData = ref(false)
const dataForm = reactive({ id: undefined as number | undefined, dictType: '', label: '', value: '', sort: 0, status: 0, remark: '' })

const typeColumns = [
  { colKey: 'name', title: '字典名称' },
  { colKey: 'type', title: '字典类型' },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'action', title: '操作', width: 130 },
]

const dataColumns = [
  { colKey: 'label', title: '字典标签' },
  { colKey: 'value', title: '字典值' },
  { colKey: 'sort', title: '排序', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'action', title: '操作', width: 130 },
]

async function fetchTypes() {
  typeLoading.value = true
  try {
    const res = await fetch('/api/system/dict-type/simple-list')
    const json = await res.json()
    if (json.success) dictTypes.value = json.data ?? []
  } finally {
    typeLoading.value = false
  }
}

async function fetchDictData(dictType: string) {
  dataLoading.value = true
  try {
    const res = await fetch(`/api/system/dict-data/list?dictType=${dictType}`)
    const json = await res.json()
    if (json.success) dictData.value = json.data ?? []
  } finally {
    dataLoading.value = false
  }
}

function onTypeClick(row: Record<string, unknown>) {
  selectedType.value = row
  dataForm.dictType = row.type as string
  fetchDictData(row.type as string)
}

function handleAddType() {
  isEditType.value = false
  Object.assign(typeForm, { id: undefined, name: '', type: '', status: 0, remark: '' })
  typeDialogVisible.value = true
}

function handleEditType(row: Record<string, unknown>) {
  isEditType.value = true
  Object.assign(typeForm, row)
  typeDialogVisible.value = true
}

async function handleSubmitType() {
  const url = isEditType.value ? '/api/system/dict-type/update' : '/api/system/dict-type/create'
  const method = isEditType.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(typeForm) })
  MessagePlugin.success(isEditType.value ? '修改成功' : '新增成功')
  typeDialogVisible.value = false
  fetchTypes()
}

async function handleDeleteType(row: Record<string, unknown>) {
  await fetch(`/api/system/dict-type/delete?id=${row.id}`, { method: 'DELETE' })
  MessagePlugin.success('删除成功')
  fetchTypes()
}

function handleAddData() {
  isEditData.value = false
  Object.assign(dataForm, { id: undefined, dictType: selectedType.value?.type, label: '', value: '', sort: 0, status: 0, remark: '' })
  dataDialogVisible.value = true
}

function handleEditData(row: Record<string, unknown>) {
  isEditData.value = true
  Object.assign(dataForm, row)
  dataDialogVisible.value = true
}

async function handleSubmitData() {
  const url = isEditData.value ? '/api/system/dict-data/update' : '/api/system/dict-data/create'
  const method = isEditData.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataForm) })
  MessagePlugin.success(isEditData.value ? '修改成功' : '新增成功')
  dataDialogVisible.value = false
  if (selectedType.value) fetchDictData(selectedType.value.type as string)
}

async function handleDeleteData(row: Record<string, unknown>) {
  await fetch(`/api/system/dict-data/delete?id=${row.id}`, { method: 'DELETE' })
  MessagePlugin.success('删除成功')
  if (selectedType.value) fetchDictData(selectedType.value.type as string)
}

onMounted(fetchTypes)
</script>

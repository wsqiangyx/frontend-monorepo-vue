<template>
  <t-dialog
    v-model:visible="visible"
    :header="isEdit ? '编辑用户' : '新增用户'"
    :confirm-btn="null"
    :cancel-btn="null"
    width="600px"
    @close="onClose"
  >
    <t-form
      ref="formRef"
      :data="formData"
      :rules="rules"
      label-width="100px"
      @submit="onSubmit"
    >
      <t-form-item label="用户昵称" name="nickname">
        <t-input v-model="formData.nickname" placeholder="请输入用户昵称" />
      </t-form-item>
      <t-form-item v-if="!isEdit" label="用户名称" name="username">
        <t-input v-model="formData.username" placeholder="请输入用户名称" />
      </t-form-item>
      <t-form-item v-if="!isEdit" label="用户密码" name="password">
        <t-input v-model="formData.password" type="password" placeholder="请输入用户密码" />
      </t-form-item>
      <t-form-item label="归属部门" name="deptId">
        <t-tree-select
          v-model="formData.deptId"
          :data="deptTree"
          placeholder="请选择归属部门"
          clearable
        />
      </t-form-item>
      <t-form-item label="手机号码" name="mobile">
        <t-input v-model="formData.mobile" placeholder="请输入手机号码" :maxlength="11" />
      </t-form-item>
      <t-form-item label="邮箱" name="email">
        <t-input v-model="formData.email" placeholder="请输入邮箱" />
      </t-form-item>
      <t-form-item label="用户性别" name="sex">
        <t-select v-model="formData.sex" placeholder="请选择性别" clearable>
          <t-option :value="0" label="男" />
          <t-option :value="1" label="女" />
        </t-select>
      </t-form-item>
      <t-form-item label="岗位" name="postIds">
        <t-select
          v-model="formData.postIds"
          :options="postOptions"
          placeholder="请选择岗位"
          multiple
          clearable
        />
      </t-form-item>
      <t-form-item label="状态" name="status">
        <t-radio-group v-model="formData.status">
          <t-radio :value="0">开启</t-radio>
          <t-radio :value="1">关闭</t-radio>
        </t-radio-group>
      </t-form-item>
      <t-form-item label="备注" name="remark">
        <t-textarea v-model="formData.remark" placeholder="请输入备注" />
      </t-form-item>
    </t-form>
    <template #footer>
      <t-space>
        <t-button theme="default" @click="visible = false">取消</t-button>
        <t-button theme="primary" :loading="submitting" @click="handleSubmit">确定</t-button>
      </t-space>
    </template>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'

defineOptions({ name: 'UserForm' })

const emit = defineEmits<{
  success: []
}>()

const visible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstanceFunctions>()

const formData = reactive({
  id: undefined as number | undefined,
  nickname: '',
  username: '',
  password: '',
  deptId: undefined as number | undefined,
  mobile: '',
  email: '',
  sex: undefined as number | undefined,
  postIds: [] as number[],
  status: 0,
  remark: '',
})

const rules = {
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 5, message: '密码至少5个字符', trigger: 'blur' },
  ],
  mobile: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  email: [
    { email: true, message: '邮箱格式不正确', trigger: 'blur' },
  ],
}

const deptTree = ref([
  { label: '总公司', value: 100, children: [
    { label: '研发部', value: 101 },
    { label: '测试部', value: 102 },
    { label: '市场部', value: 103 },
    { label: '财务部', value: 104 },
  ]},
])

const postOptions = [
  { label: '董事长', value: 1 },
  { label: '技术总监', value: 2 },
  { label: '人力资源', value: 3 },
  { label: '普通员工', value: 4 },
]

async function open(id?: number) {
  visible.value = true
  resetForm()

  if (id) {
    isEdit.value = true
    try {
      const res = await fetch(`/api/system/user/get?id=${id}`)
      const json = await res.json()
      if (json.success) {
        Object.assign(formData, json.data)
      }
    } catch {
      MessagePlugin.error('获取用户信息失败')
    }
  } else {
    isEdit.value = false
  }
}

function resetForm() {
  formData.id = undefined
  formData.nickname = ''
  formData.username = ''
  formData.password = ''
  formData.deptId = undefined
  formData.mobile = ''
  formData.email = ''
  formData.sex = undefined
  formData.postIds = []
  formData.status = 0
  formData.remark = ''
}

function onClose() {
  formRef.value?.reset()
}

async function handleSubmit() {
  const result = await formRef.value?.validate()
  if (result !== true) return

  submitting.value = true
  try {
    const url = isEdit.value ? '/api/system/user/update' : '/api/system/user/create'
    const method = isEdit.value ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    MessagePlugin.success(isEdit.value ? '修改成功' : '新增成功')
    visible.value = false
    emit('success')
  } catch {
    MessagePlugin.error(isEdit.value ? '修改失败' : '新增失败')
  } finally {
    submitting.value = false
  }
}

function onSubmit({ validateResult }: { validateResult: boolean }) {
  if (validateResult) handleSubmit()
}

defineExpose({ open })
</script>

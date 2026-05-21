<template>
  <PageContainer title="个人中心">
    <t-row :gutter="16">
      <t-col :span="8">
        <t-card title="基本信息">
          <t-form :data="formData" label-width="100px">
            <t-form-item label="用户昵称" name="nickname">
              <t-input v-model="formData.nickname" placeholder="请输入用户昵称" />
            </t-form-item>
            <t-form-item label="手机号码" name="mobile">
              <t-input v-model="formData.mobile" placeholder="请输入手机号码" />
            </t-form-item>
            <t-form-item label="邮箱" name="email">
              <t-input v-model="formData.email" placeholder="请输入邮箱" />
            </t-form-item>
            <t-form-item label="性别" name="sex">
              <t-radio-group v-model="formData.sex">
                <t-radio :value="0">男</t-radio>
                <t-radio :value="1">女</t-radio>
              </t-radio-group>
            </t-form-item>
            <t-form-item>
              <t-button theme="primary" @click="handleSave">保存</t-button>
            </t-form-item>
          </t-form>
        </t-card>
      </t-col>
      <t-col :span="8">
        <t-card title="修改密码">
          <t-form :data="passwordForm" label-width="100px">
            <t-form-item label="旧密码" name="oldPassword">
              <t-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" />
            </t-form-item>
            <t-form-item label="新密码" name="newPassword">
              <t-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
            </t-form-item>
            <t-form-item label="确认密码" name="confirmPassword">
              <t-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
            </t-form-item>
            <t-form-item>
              <t-button theme="primary" @click="handleChangePassword">修改密码</t-button>
            </t-form-item>
          </t-form>
        </t-card>
      </t-col>
    </t-row>
  </PageContainer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { PageContainer } from '@repo/shared-ui'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'Profile' })

const userStore = useUserStore()
const info = userStore.userInfo as Record<string, unknown> | null

const formData = reactive({
  nickname: (info?.nickname as string) ?? '',
  mobile: (info?.mobile as string) ?? '',
  email: (info?.email as string) ?? '',
  sex: (info?.sex as number) ?? 0,
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function handleSave() {
  MessagePlugin.success('保存成功')
}

function handleChangePassword() {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    MessagePlugin.warning('两次密码不一致')
    return
  }
  if (!passwordForm.oldPassword || !passwordForm.newPassword) {
    MessagePlugin.warning('请填写完整')
    return
  }
  MessagePlugin.success('密码修改成功')
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>

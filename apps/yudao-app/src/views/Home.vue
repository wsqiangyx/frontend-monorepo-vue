<template>
  <PageContainer title="首页">
    <t-row :gutter="16">
      <t-col :span="8">
        <t-card title="欢迎">
          <t-result
            status="success"
            title="芋道管理系统已启动"
            description="芋道 Vue3 管理后台迁移脚手架已成功运行。可访问系统管理模块体验各功能。"
          >
            <template #extra>
              <AuthButton theme="primary" @click="$router.push('/system/user')">
                进入用户管理
              </AuthButton>
            </template>
          </t-result>
        </t-card>
      </t-col>
      <t-col :span="4">
        <t-card title="快捷操作">
          <t-space direction="vertical" :size="8" class="w-full">
            <t-button theme="default" block @click="$router.push('/system/user')">用户管理</t-button>
            <t-button theme="default" block @click="$router.push('/system/role')">角色管理</t-button>
            <t-button theme="default" block @click="$router.push('/system/menu')">菜单管理</t-button>
          </t-space>
        </t-card>
      </t-col>
    </t-row>
  </PageContainer>
</template>

<script setup lang="ts">
import { PageContainer, AuthButton } from '@repo/shared-ui'

defineOptions({ name: 'HomePage' })
</script>

<template>
  <t-layout class="admin-layout">
    <t-aside>
      <SidebarMenu :options="menuOptions" :active-key="activeMenu" @update:active-key="onMenuChange" />
    </t-aside>
    <t-layout>
      <t-header>
        <div class="admin-header">
          <span class="admin-header__title">Vue3 Admin</span>
        </div>
      </t-header>
      <t-content>
        <PageContainer title="首页">
          <t-card>
            <t-result
              status="success"
              title="应用已启动"
              description="Vue3 中后台前端平台脚手架已成功运行。"
            >
              <template #extra>
                <AuthButton theme="primary" @click="handleAction">
                  权限按钮示例
                </AuthButton>
              </template>
            </t-result>
          </t-card>
        </PageContainer>
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageContainer, SidebarMenu, AuthButton } from '@repo/shared-ui'
import type { SidebarMenuItem } from '@repo/shared-ui'

defineOptions({ name: 'HomePage' })

const menuOptions: SidebarMenuItem[] = [
  { value: 'home', label: '首页' },
  { value: 'system', label: '系统管理' },
  { value: 'dashboard', label: '仪表盘' },
]

const activeMenu = ref('home')

function onMenuChange(key: string) {
  activeMenu.value = key
}

function handleAction() {
  // 示例按钮点击
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.admin-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 100%;
}

.admin-header__title {
  font-size: 18px;
  font-weight: 700;
}
</style>

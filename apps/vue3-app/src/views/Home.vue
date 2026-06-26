<template>
   <el-container class="admin-layout">
     <el-aside width="auto">
      <SidebarMenu :options="menuOptions" :active-key="activeMenu" @update:active-key="onMenuChange" />
     </el-aside>
     <el-container>
       <el-header>
        <div class="admin-header">
          <span class="admin-header__title">Vue3 Admin</span>
        </div>
       </el-header>
       <el-main>
        <PageContainer title="首页">
           <el-card>
             <el-result
              status="success"
              title="应用已启动"
              description="Vue3 中后台前端平台脚手架已成功运行。"
            >
              <template #extra>
                 <AuthButton type="primary" @click="handleAction">
                  权限按钮示例
                </AuthButton>
              </template>
             </el-result>
           </el-card>
        </PageContainer>
       </el-main>
     </el-container>
   </el-container>
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

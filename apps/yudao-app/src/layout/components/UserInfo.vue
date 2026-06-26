<template>
  <t-dropdown :options="userOptions" @click="onUserAction">
    <div class="user-info">
      <t-avatar :image="avatar" size="28px">
        {{ displayName?.charAt(0) || 'U' }}
      </t-avatar>
      <span class="user-info__name">{{ displayName || '用户' }}</span>
      <t-icon name="chevron-down" size="16px" />
    </div>
  </t-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

defineOptions({ name: 'UserInfo' })

const router = useRouter()
const userStore = useUserStore()

const displayName = computed(() => userStore.nickname)
const avatar = computed(() => userStore.avatar)

const userOptions = [
  { content: '个人中心', value: 'profile', prefixIcon: 'user' },
  { content: '退出登录', value: 'logout', prefixIcon: 'poweroff' },
]

function onUserAction({ value }: { value: string }) {
  switch (value) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}

function handleLogout() {
  ElMessageBox.confirm('确认退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 8px;
}

.user-info__name {
  font-size: 14px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

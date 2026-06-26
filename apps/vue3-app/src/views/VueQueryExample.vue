<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'
import { PageContainer } from '@repo/shared-ui'
import { ElButton, ElCard, ElDescriptions, ElDescriptionsItem, ElTag, ElMessage, ElSpin } from 'element-plus'
import type { ApiResponse } from '@repo/shared-service'

defineOptions({ name: 'VueQueryExamplePage' })

interface User {
  id: string
  username: string
  displayName: string
  email: string
  roles: string[]
}

// 模拟 API 请求函数
async function fetchUser(): Promise<ApiResponse<User>> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    success: true,
    code: '0',
    data: {
      id: '1',
      username: 'admin',
      displayName: '管理员',
      email: 'admin@example.com',
      roles: ['admin', 'editor'],
    },
    message: 'success',
    timestamp: new Date().toISOString(),
  }
}

async function updateUser(data: Partial<User>): Promise<ApiResponse<User>> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    success: true,
    code: '0',
    data: {
      id: '1',
      username: 'admin',
      displayName: data.displayName ?? '管理员',
      email: data.email ?? 'admin@example.com',
      roles: ['admin', 'editor'],
    },
    message: 'success',
    timestamp: new Date().toISOString(),
  }
}

// useQuery: 数据获取
const {
  data: userData,
  isLoading,
  isError,
  error,
  refetch,
} = useQuery({
  queryKey: ['user', 'current'],
  queryFn: fetchUser,
  staleTime: 60 * 1000, // 1 分钟内数据视为新鲜
})

// useMutation: 数据变更
const queryClient = useQueryClient()
const displayNameInput = ref('')

const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    // 成功后刷新 user query
    queryClient.invalidateQueries({ queryKey: ['user', 'current'] })
    ElMessage.success('更新成功')
    displayNameInput.value = ''
  },
  onError: (err) => {
    ElMessage.error(`更新失败: ${err.message}`)
  },
})

function handleUpdate() {
  if (!displayNameInput.value.trim()) {
    ElMessage.warning('请输入新的显示名称')
    return
  }
  mutation.mutate({ displayName: displayNameInput.value })
}
</script>

<template>
  <PageContainer title="Vue Query 示例">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据获取示例 (useQuery)</span>
          <el-button @click="refetch" :loading="isLoading">刷新</el-button>
        </div>
      </template>

      <el-spin :loading="isLoading">
        <template v-if="isError">
          <el-tag type="danger">加载失败: {{ error?.message }}</el-tag>
        </template>

        <template v-else-if="userData?.data">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户ID">{{ userData.data.id }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ userData.data.username }}</el-descriptions-item>
            <el-descriptions-item label="显示名称">{{ userData.data.displayName }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userData.data.email }}</el-descriptions-item>
            <el-descriptions-item label="角色" :span="2">
              <el-tag v-for="role in userData.data.roles" :key="role" class="mr-2">
                {{ role }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-spin>
    </el-card>

    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>数据变更示例 (useMutation)</span>
          <el-tag :type="mutation.isPending ? 'warning' : mutation.isSuccess ? 'success' : 'info'">
            {{ mutation.isPending ? '提交中...' : mutation.isSuccess ? '成功' : '待提交' }}
          </el-tag>
        </div>
      </template>

      <div class="mutation-form">
        <el-input
          v-model="displayNameInput"
          placeholder="输入新的显示名称"
          clearable
          class="input-field"
        />
        <el-button
          type="primary"
          @click="handleUpdate"
          :loading="mutation.isPending"
          :disabled="mutation.isPending"
        >
          更新显示名称
        </el-button>
      </div>

      <div class="tips">
        <p>提示: 更新成功后，上方的用户信息会自动刷新（通过 invalidateQueries）</p>
      </div>
    </el-card>
  </PageContainer>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.mutation-form {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.input-field {
  flex: 1;
  max-width: 400px;
}

.tips {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
}

.tips p {
  margin: 0;
}
</style>

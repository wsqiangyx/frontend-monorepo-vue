import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAccessToken, setToken, removeToken } from '@repo/shared-service'
import type { LoginParams } from '@repo/shared-service'

interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const roles = ref<string[]>([])
  const permissions = ref<Set<string>>(new Set())

  const isLoggedIn = computed(() => !!getAccessToken())
  const username = computed(() => userInfo.value?.username || '')
  const nickname = computed(() => userInfo.value?.nickname || userInfo.value?.username || '用户')
  const avatar = computed(() => userInfo.value?.avatar || '')

  async function login(params: LoginParams) {
    void params // TODO: 对接真实 API 时使用
    // TODO: 对接真实 API
    // const authApi = createAuthApi(httpClient)
    // const result = await authApi.login(params)
    // setToken(result)

    // Mock 登录
    setToken({
      accessToken: `mock-access-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    })

    return true
  }

  async function fetchUserInfo() {
    // TODO: 对接真实 API
    // const authApi = createAuthApi(httpClient)
    // const info = await authApi.getUserInfo()

    // Mock 用户信息
    userInfo.value = {
      id: 1,
      username: 'admin',
      nickname: '管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['*:*:*'],
    }
    roles.value = ['admin']
    permissions.value = new Set(['*:*:*'])

    return userInfo.value
  }

  async function logout() {
    // TODO: 调用 logout API
    removeToken()
    resetState()
  }

  function resetState() {
    userInfo.value = null
    roles.value = []
    permissions.value = new Set()
  }

  function hasPermission(code: string): boolean {
    if (permissions.value.has('*:*:*')) return true
    return permissions.value.has(code)
  }

  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  return {
    userInfo,
    roles,
    permissions,
    isLoggedIn,
    username,
    nickname,
    avatar,
    login,
    fetchUserInfo,
    logout,
    resetState,
    hasPermission,
    hasRole,
  }
})

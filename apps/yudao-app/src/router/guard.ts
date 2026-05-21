import type { Router } from 'vue-router'
import { getAccessToken } from '@repo/shared-service'

const WHITE_LIST = ['/login', '/404']

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const token = getAccessToken()

    // 白名单直接放行
    if (WHITE_LIST.includes(to.path)) {
      if (token && to.path === '/login') {
        next('/')
        return
      }
      next()
      return
    }

    // 无 Token 跳登录
    if (!token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    // 有 Token 访问登录页直接跳首页
    if (to.path === '/login') {
      next('/')
      return
    }

    // TODO: 动态路由加载（Phase 2 完善）
    // const userStore = useUserStore()
    // const permissionStore = usePermissionStore()
    // if (!userStore.userInfo) {
    //   await userStore.fetchUserInfo()
    //   const accessRoutes = permissionStore.generateRoutes(userStore.roles)
    //   accessRoutes.forEach((route) => router.addRoute(route))
    //   next({ ...to, replace: true })
    //   return
    // }

    next()
  })
}

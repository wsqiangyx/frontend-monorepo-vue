import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { staticRoutes, asyncRoutes } from '../router'

export const usePermissionStore = defineStore('permission', () => {
  const routes = shallowRef<RouteRecordRaw[]>([])
  const addedRoutes = shallowRef<RouteRecordRaw[]>([])

  function generateRoutes(userRoles: string[]) {
    const filtered = filterRoutesByRoles(asyncRoutes, userRoles)
    addedRoutes.value = filtered
    routes.value = [...staticRoutes, ...filtered]
    return filtered
  }

  function resetRoutes() {
    routes.value = [...staticRoutes]
    addedRoutes.value = []
  }

  return {
    routes,
    addedRoutes,
    generateRoutes,
    resetRoutes,
  }
})

function filterRoutesByRoles(routeList: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  if (roles.includes('admin')) {
    return routeList
  }

  return routeList
    .map((route) => {
      const meta = route.meta as Record<string, unknown> | undefined
      const requiredRoles = meta?.roles as string[] | undefined

      if (!requiredRoles || requiredRoles.some((r) => roles.includes(r))) {
        if (route.children) {
          return {
            ...route,
            children: filterRoutesByRoles(route.children, roles),
          } as RouteRecordRaw
        }
        return route
      }

      return null
    })
    .filter((r): r is RouteRecordRaw => r !== null)
}

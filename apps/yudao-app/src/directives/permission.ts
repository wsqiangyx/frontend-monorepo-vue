import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-permission 权限指令
 * 用法：v-permission="'system:user:add'" 或 v-permission="['system:user:add', 'system:user:edit']"
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const requiredPermissions = Array.isArray(binding.value) ? binding.value : [binding.value]

    // TODO: 从 userStore 获取权限列表
    const userPermissions = new Set<string>(['*:*:*'])

    const hasPermission =
      userPermissions.has('*:*:*') || requiredPermissions.some((p) => userPermissions.has(p))

    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  },
}

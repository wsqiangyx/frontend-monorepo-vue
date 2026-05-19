<template>
  <t-button v-if="visible" v-bind="$attrs">
    <slot />
  </t-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'
import { hasPermission, asPermissionCode } from '@repo/shared-service'
import type { PermissionSet } from '@repo/shared-service'

const props = defineProps<{
  /** 简单布尔开关 — 设为 false 时隐藏按钮 */
  permission?: boolean
  /** 权限码 — 与 permissionSet 配合使用时，检查当前用户是否有此权限 */
  permissionCode?: string
  /** 当前用户权限集 — 由应用层注入 */
  permissionSet?: PermissionSet
}>()

const visible = computed(() => {
  if (props.permissionCode && props.permissionSet) {
    return hasPermission(props.permissionSet, asPermissionCode(props.permissionCode))
  }
  return props.permission !== false
})
</script>

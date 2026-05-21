<template>
  <t-menu
    :value="activeKey"
    :collapsed="collapsed"
    :expand-mutex="false"
    theme="light"
    @change="onChange"
  >
    <template v-for="item in menus" :key="item.value">
      <t-submenu v-if="item.children?.length" :value="item.value" :title="item.label">
        <template #icon>
          <t-icon v-if="item.icon" :name="item.icon" />
        </template>
        <t-menu-item v-for="child in item.children" :key="child.value" :value="child.value">
          <template #icon>
            <t-icon v-if="child.icon" :name="child.icon" />
          </template>
          {{ child.label }}
        </t-menu-item>
      </t-submenu>
      <t-menu-item v-else :value="item.value">
        <template #icon>
          <t-icon v-if="item.icon" :name="item.icon" />
        </template>
        {{ item.label }}
      </t-menu-item>
    </template>
  </t-menu>
</template>

<script setup lang="ts">
import type { SidebarMenuItem } from '@repo/shared-ui'

interface MenuItem extends SidebarMenuItem {
  icon?: string
  children?: MenuItem[]
}

defineProps<{
  menus: MenuItem[]
  activeKey: string
  collapsed?: boolean
}>()

const emit = defineEmits<{
  'update:active-key': [key: string]
}>()

function onChange(key: string) {
  emit('update:active-key', key)
}
</script>

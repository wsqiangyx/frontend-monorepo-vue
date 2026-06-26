<template>
   <el-menu :default-active="activeKey" @select="handleMenuClick">
     <el-menu-item v-for="item in props.options" :key="item.value" :index="item.value">
      {{ item.label }}
     </el-menu-item>
   </el-menu>
</template>

<script setup lang="ts">
import type { SidebarMenuItem } from '../types'

const props = defineProps<{
  options: SidebarMenuItem[]
  activeKey?: string
}>()

const emit = defineEmits<{
  (e: 'update:activeKey', key: string): void
}>()

function handleMenuClick(value: string | number) {
  emit('update:activeKey', String(value))
}
</script>

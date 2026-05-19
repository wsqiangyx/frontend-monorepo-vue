<template>
  <t-menu :value="activeKey" @change="handleMenuClick">
    <t-menu-item v-for="item in options" :key="item.value" :value="item.value">
      {{ item.label }}
    </t-menu-item>
  </t-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Menu as TMenu, MenuItem as TMenuItem } from 'tdesign-vue-next'
import type { SidebarMenuItem } from '../types'

const props = defineProps<{
  options: SidebarMenuItem[]
  activeKey?: string
}>()

const emit = defineEmits<{
  (e: 'update:activeKey', key: string): void
}>()

const options = computed(() => props.options)

function handleMenuClick(value: string | number) {
  emit('update:activeKey', String(value))
}
</script>

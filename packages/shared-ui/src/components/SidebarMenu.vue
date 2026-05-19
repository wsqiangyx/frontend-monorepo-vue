<template>
  <n-menu :options="menuOptions" :value="activeKey" @update:value="handleMenuClick" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'

const props = defineProps<{
  options: MenuOption[]
  activeKey?: string
}>()

const emit = defineEmits<{
  (e: 'update:activeKey', key: string): void
}>()

const menuOptions = computed(() => props.options)

function handleMenuClick(key: string) {
  emit('update:activeKey', key)
}
</script>

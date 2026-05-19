<template>
  <n-layout-content :style="{ padding: '24px' }">
    <n-h3 v-if="title" style="margin: 0 0 16px">{{ title }}</n-h3>
    <slot />
  </n-layout-content>
</template>

<script setup lang="ts">
import { NLayoutContent, NH3 } from 'naive-ui'

defineProps<{
  title?: string
}>()
</script>

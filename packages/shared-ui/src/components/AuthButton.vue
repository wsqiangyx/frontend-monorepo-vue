<template>
  <t-button v-if="visible" v-bind="$attrs">
    <slot />
  </t-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button as TButton } from 'tdesign-vue-next'

const props = defineProps<{
  permission?: boolean
}>()

const visible = computed(() => props.permission !== false)
</script>

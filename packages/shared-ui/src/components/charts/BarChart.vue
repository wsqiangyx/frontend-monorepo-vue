<template>
  <BaseChart
    :data="data"
    :loading="loading"
    :empty="!loading && data.length === 0"
    :height="height"
    :config="mergedConfig"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

defineOptions({ name: 'BarChart' })

const props = withDefaults(
  defineProps<{
    data: Record<string, unknown>[]
    xField?: string
    yField?: string
    seriesField?: string
    height?: number
    stack?: boolean
    loading?: boolean
  }>(),
  {
    xField: 'x',
    yField: 'y',
    height: 300,
    stack: false,
    loading: false,
  },
)

const mergedConfig = computed(() => ({
  type: 'interval',
  encode: {
    x: props.xField,
    y: props.yField,
    color: props.seriesField,
  },
  transform: props.stack ? [{ type: 'stackY' }] : [],
  interaction: { elementHighlight: { background: true } },
}))
</script>

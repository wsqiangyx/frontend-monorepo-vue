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

defineOptions({ name: 'LineChart' })

const props = withDefaults(
  defineProps<{
    data: Record<string, unknown>[]
    xField?: string
    yField?: string
    seriesField?: string
    height?: number
    smooth?: boolean
    loading?: boolean
  }>(),
  {
    xField: 'x',
    yField: 'y',
    height: 300,
    smooth: false,
    loading: false,
  },
)

const mergedConfig = computed(() => ({
  type: 'view',
  children: [
    {
      type: 'line',
      encode: {
        x: props.xField,
        y: props.yField,
        color: props.seriesField,
      },
      style: {
        shape: props.smooth ? 'smooth' : undefined,
      },
    },
    {
      type: 'point',
      encode: {
        x: props.xField,
        y: props.yField,
        color: props.seriesField,
      },
      style: { r: 3 },
      tooltip: false,
    },
  ],
}))
</script>

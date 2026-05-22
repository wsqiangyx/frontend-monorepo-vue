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

defineOptions({ name: 'PieChart' })

const props = withDefaults(
  defineProps<{
    data: Record<string, unknown>[]
    angleField?: string
    colorField?: string
    innerRadius?: number
    height?: number
    loading?: boolean
  }>(),
  {
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    height: 300,
    loading: false,
  },
)

const mergedConfig = computed(() => ({
  type: 'interval',
  encode: {
    y: props.angleField,
    color: props.colorField,
  },
  transform: [{ type: 'stackY' }],
  coordinate: { type: 'theta', innerRadius: props.innerRadius },
  interaction: { elementHighlight: true },
  legend: { color: { position: 'bottom' } },
}))
</script>

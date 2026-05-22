<template>
  <div ref="containerRef" class="base-chart">
    <t-loading v-if="loading" size="small" />
    <t-empty v-else-if="empty" description="暂无数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Chart } from '@antv/g2'

defineOptions({ name: 'BaseChart' })

const props = withDefaults(
  defineProps<{
    data?: Record<string, unknown>[]
    loading?: boolean
    empty?: boolean
    autoFit?: boolean
    height?: number
    padding?: number[]
    config?: Record<string, unknown>
  }>(),
  {
    data: () => [],
    loading: false,
    empty: false,
    autoFit: true,
    height: 300,
    config: () => ({}),
  },
)

const emit = defineEmits<{
  ready: [chart: Chart]
}>()

const containerRef = ref<HTMLElement>()
let chart: Chart | null = null

function createChart() {
  if (!containerRef.value) return
  chart = new Chart({
    container: containerRef.value,
    autoFit: props.autoFit,
    height: props.height,
    padding: props.padding as any,
  })
  emit('ready', chart)
}

function renderChart() {
  if (!chart) return
  if (props.data.length === 0) return
  chart.options(props.config)
  chart.data(props.data)
  chart.render()
}

function destroyChart() {
  if (chart) {
    chart.destroy()
    chart = null
  }
}

onMounted(() => {
  createChart()
  nextTick(renderChart)
})

onUnmounted(destroyChart)

watch(
  () => props.data,
  () => {
    if (chart && props.data.length > 0) {
      chart.data(props.data)
      chart.render()
    }
  },
  { deep: true },
)

watch(
  () => props.config,
  () => {
    if (chart) {
      chart.options(props.config)
      chart.render()
    }
  },
  { deep: true },
)

defineExpose({ getChart: () => chart })
</script>

<style scoped>
.base-chart {
  position: relative;
  width: 100%;
  min-height: 200px;
}
</style>

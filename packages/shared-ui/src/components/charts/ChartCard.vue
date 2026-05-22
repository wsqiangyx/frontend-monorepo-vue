<template>
  <t-card class="chart-card" :bordered="false">
    <template #header>
      <div class="chart-card__header">
        <span class="chart-card__title">{{ title }}</span>
        <span v-if="total !== undefined" class="chart-card__total">{{ total }}</span>
      </div>
    </template>
    <template #headerRight>
      <slot name="extra" />
    </template>
    <slot />
  </t-card>
</template>

<script setup lang="ts">
defineOptions({ name: 'ChartCard' })

withDefaults(
  defineProps<{
    title: string
    total?: string | number
  }>(),
  {},
)
</script>

<style scoped>
.chart-card__header {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.chart-card__title {
  font-size: 14px;
  color: var(--color-text-secondary, #666);
}

.chart-card__total {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}
</style>

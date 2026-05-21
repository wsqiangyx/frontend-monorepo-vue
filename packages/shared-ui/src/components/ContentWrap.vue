<template>
  <div class="content-wrap">
    <div v-if="title" class="content-wrap__header">
      <h3 class="content-wrap__title">{{ title }}</h3>
      <div v-if="$slots.extra" class="content-wrap__extra">
        <slot name="extra" />
      </div>
    </div>
    <t-loading :loading="loading" :size="loadingSize">
      <t-empty v-if="empty" :description="emptyText" />
      <t-result
        v-else-if="error"
        status="error"
        title="加载失败"
        :description="error"
      >
        <template #extra>
          <t-button theme="primary" @click="$emit('retry')">重试</t-button>
        </template>
      </t-result>
      <slot v-else />
    </t-loading>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ContentWrap' })

withDefaults(
  defineProps<{
    title?: string
    loading?: boolean
    empty?: boolean
    emptyText?: string
    error?: string
    loadingSize?: string
  }>(),
  {
    loading: false,
    empty: false,
    emptyText: '暂无数据',
    loadingSize: 'medium',
  },
)

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.content-wrap {
  background: var(--color-bg-container);
  border-radius: var(--radius-default);
  padding: 16px;
}

.content-wrap__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.content-wrap__title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
</style>

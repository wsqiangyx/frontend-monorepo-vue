<template>
  <div class="page-container">
    <h3 v-if="title" class="page-container__title">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-container__title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
}
</style>

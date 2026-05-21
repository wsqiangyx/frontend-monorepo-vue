<template>
  <t-breadcrumb class="admin-breadcrumb">
    <t-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
      {{ item.title }}
    </t-breadcrumb-item>
  </t-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'AppBreadcrumb' })

const route = useRoute()

interface BreadcrumbItem {
  title: string
  path: string
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter(
    (item) => item.meta?.title && item.path !== '/',
  )

  const items: BreadcrumbItem[] = [
    { title: '首页', path: '/' },
  ]

  for (const item of matched) {
    items.push({
      title: item.meta.title as string,
      path: item.path,
    })
  }

  return items
})
</script>

<style scoped>
.admin-breadcrumb {
  margin-left: 8px;
}
</style>

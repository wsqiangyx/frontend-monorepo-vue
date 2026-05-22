<template>
  <PageContainer title="大屏设计器">
    <t-card :bordered="false" :body-style="{ padding: 0 }">
      <iframe
        :src="src"
        class="report-iframe"
        frameborder="0"
      />
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'GoView' })

const goviewUrl = import.meta.env.VITE_GOVIEW_URL || 'http://localhost:9090'
const src = ref(goviewUrl)
</script>

<style scoped>
.report-iframe {
  width: 100%;
  height: calc(100vh - 200px);
  border: none;
}
</style>

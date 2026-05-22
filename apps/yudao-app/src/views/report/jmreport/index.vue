<template>
  <PageContainer title="报表设计器">
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

defineOptions({ name: 'JimuReport' })

const baseUrl = import.meta.env.VITE_API_BASE_URL || '/admin-api'
const src = ref(`${baseUrl}/jmreport/list`)
</script>

<style scoped>
.report-iframe {
  width: 100%;
  height: calc(100vh - 200px);
  border: none;
}
</style>

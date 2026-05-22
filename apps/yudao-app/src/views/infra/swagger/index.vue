<template>
  <PageContainer title="系统接口">
    <t-card class="swagger-card">
      <iframe
        src="/swagger-ui.html"
        frameborder="0"
        width="100%"
        :style="{ height: iframeHeight, border: 'none' }"
      />
    </t-card>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PageContainer } from '@repo/shared-ui'

defineOptions({ name: 'InfraSwagger' })

const iframeHeight = ref('calc(100vh - 200px)')

function updateHeight() {
  iframeHeight.value = `${window.innerHeight - 200}px`
}

onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
})
</script>

<style scoped>
.swagger-card {
  padding: 0;
}
.swagger-card :deep(.t-card__body) {
  padding: 0;
}
</style>

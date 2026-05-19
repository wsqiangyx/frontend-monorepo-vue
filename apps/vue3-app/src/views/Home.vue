<template>
  <n-layout>
    <n-layout-header bordered>
      <n-space align="center" style="padding: 16px">
        <n-h2 style="margin: 0">Vue3 Admin</n-h2>
      </n-space>
    </n-layout-header>
    <n-layout-content style="padding: 24px">
      <n-result status="success" title="应用已启动" description="Vue3 中后台前端平台脚手架已成功运行。">
        <template #footer>
          <n-text depth="3">
            基于 Vue3 + Naive UI + Pinia + vue-router
          </n-text>
        </template>
      </n-result>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { NLayout, NLayoutHeader, NLayoutContent, NSpace, NH2, NResult, NText } from 'naive-ui'
</script>

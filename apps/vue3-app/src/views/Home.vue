<template>
  <t-layout>
    <t-header>
      <t-head-menu>
        <template #logo>
          <span style="font-size: 20px; font-weight: 700">Vue3 Admin</span>
        </template>
      </t-head-menu>
    </t-header>
    <t-content>
      <div style="padding: 24px">
        <t-card>
          <t-result
            status="success"
            title="应用已启动"
            description="Vue3 中后台前端平台脚手架已成功运行。"
          >
            <template #extra>
              <span style="color: var(--td-text-color-secondary)">
                基于 Vue3 + TDesign + Pinia + vue-router
              </span>
            </template>
          </t-result>
        </t-card>
      </div>
    </t-content>
  </t-layout>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' })
</script>

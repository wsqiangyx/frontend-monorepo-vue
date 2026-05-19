<template>
  <t-config-provider :global-config="globalConfig">
    <router-view />
  </t-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ConfigProvider as TConfigProvider } from 'tdesign-vue-next'
import zhCN from 'tdesign-vue-next/es/locale/zh_CN'
import enUS from 'tdesign-vue-next/es/locale/en_US'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const localeMap: Record<string, unknown> = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const globalConfig = computed(() => ({
  locale: localeMap[locale.value] ?? localeMap['zh-CN'],
})) as unknown as Record<string, unknown>
</script>

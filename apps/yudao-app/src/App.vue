<template>
  <t-config-provider :global-config="globalConfig">
    <router-view />
  </t-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCN from 'tdesign-vue-next/es/locale/zh_CN'
import enUS from 'tdesign-vue-next/es/locale/en_US'
import { resolveTDesignLocale } from '@repo/shared-i18n'
import type { TDesignLocaleMap } from '@repo/shared-i18n'

const { locale } = useI18n()

const localeMap: TDesignLocaleMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const globalConfig = computed(() => ({
  locale: resolveTDesignLocale(locale.value as 'zh-CN' | 'en-US', localeMap),
})) as unknown as Record<string, unknown>
</script>

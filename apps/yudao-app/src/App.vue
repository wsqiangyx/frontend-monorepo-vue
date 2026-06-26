<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import enUS from 'element-plus/es/locale/lang/en'
import { resolveElementPlusLocale } from '@repo/shared-i18n'
import type { ElementPlusLocaleMap } from '@repo/shared-i18n'

const { locale } = useI18n()

const localeMap: ElementPlusLocaleMap = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const elLocale = computed(() => resolveElementPlusLocale(locale.value as 'zh-CN' | 'en-US', localeMap))
</script>

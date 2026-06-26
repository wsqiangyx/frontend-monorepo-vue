<template>
   <el-config-provider :locale="currentLocale">
    <router-view />
   </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
 import zhCn from 'element-plus/es/locale/lang/zh-cn'
 import en from 'element-plus/es/locale/lang/en'
 import { resolveElementPlusLocale } from '@repo/shared-i18n'
 import type { ElementPlusLocaleMap } from '@repo/shared-i18n'

const { locale } = useI18n()

 const localeMap: ElementPlusLocaleMap = {
   'zh-CN': zhCn,
   'en-US': en,
}

 const currentLocale = computed(() =>
   resolveElementPlusLocale(locale.value as 'zh-CN' | 'en-US', localeMap),
 )
</script>

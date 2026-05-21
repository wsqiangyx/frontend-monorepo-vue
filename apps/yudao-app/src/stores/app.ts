import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const collapsed = ref(false)
  const device = ref<'desktop' | 'mobile'>('desktop')
  const theme = ref<'light' | 'dark'>('light')
  const locale = ref<'zh-CN' | 'en-US'>('zh-CN')

  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  function setCollapsed(value: boolean) {
    collapsed.value = value
  }

  function setDevice(value: 'desktop' | 'mobile') {
    device.value = value
  }

  function setTheme(value: 'light' | 'dark') {
    theme.value = value
  }

  function setLocale(value: 'zh-CN' | 'en-US') {
    locale.value = value
  }

  return {
    collapsed,
    device,
    theme,
    locale,
    toggleCollapsed,
    setCollapsed,
    setDevice,
    setTheme,
    setLocale,
  }
})

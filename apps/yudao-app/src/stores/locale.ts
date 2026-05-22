import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'

export const useLocaleStore = defineStore('locale', () => {
  const appStore = useAppStore()
  const currentLocale = ref<'zh-CN' | 'en-US'>(appStore.locale)

  function switchLocale(locale: 'zh-CN' | 'en-US') {
    currentLocale.value = locale
    appStore.setLocale(locale)
    localStorage.setItem('locale', locale)
  }

  function initLocale() {
    const saved = localStorage.getItem('locale') as 'zh-CN' | 'en-US' | null
    if (saved && (saved === 'zh-CN' || saved === 'en-US')) {
      currentLocale.value = saved
      appStore.setLocale(saved)
    }
  }

  return {
    currentLocale,
    switchLocale,
    initLocale,
  }
})

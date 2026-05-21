import type { Directive, DirectiveBinding } from 'vue'

/**
 * v-debounce 防抖指令
 * 用法：v-debounce="handleClick" 或 v-debounce:500="handleClick"
 */
export const debounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<() => void>) {
    const delay = Number(binding.arg) || 300
    let timer: ReturnType<typeof setTimeout> | null = null

    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        binding.value?.()
        timer = null
      }, delay)
    })
  },
}

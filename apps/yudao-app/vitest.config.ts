import { defineProject } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { appAliasEntries, sharedPackageAliases } from './paths.config'

export default defineProject({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      ...appAliasEntries,
      ...sharedPackageAliases,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'threads',
    setupFiles: ['./src/test/setup.ts'],
  },
})

import { defineProject } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { appAliasEntries, sharedPackageAliases } from './paths.config'

export default defineProject({
  plugins: [vue(), tailwindcss()],
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

import { defineProject } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

const root = resolve(__dirname, '../..')

export default defineProject({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@repo/shared-ui': resolve(root, 'packages/shared-ui/src'),
      '@repo/shared-i18n': resolve(root, 'packages/shared-i18n/src'),
      '@repo/shared-utils': resolve(root, 'packages/shared-utils/src'),
      '@repo/shared-service': resolve(root, 'packages/shared-service/src'),
      '@repo/design-tokens': resolve(root, 'packages/design-tokens/src'),
      '@repo/shared-workflow': resolve(root, 'packages/shared-workflow/src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'threads',
    setupFiles: ['./src/test/setup.ts'],
  },
})

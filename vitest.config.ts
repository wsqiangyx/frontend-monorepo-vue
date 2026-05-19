import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/shared-utils/vitest.config.ts',
      'packages/shared-i18n/vitest.config.ts',
      'packages/shared-service/vitest.config.ts',
      'packages/design-tokens/vitest.config.ts',
      'packages/shared-ui/vitest.config.ts',
      'packages/shared-workflow/vitest.config.ts',
      'apps/vue3-app/vitest.config.ts',
    ],
  },
})

import { resolve } from 'node:path'

const rootDir = resolve(__dirname, '../..')

export const sharedPackageAliases = {
  '@repo/shared-ui': resolve(rootDir, 'packages/shared-ui/src'),
  '@repo/shared-i18n': resolve(rootDir, 'packages/shared-i18n/src'),
  '@repo/shared-utils': resolve(rootDir, 'packages/shared-utils/src'),
  '@repo/shared-service': resolve(rootDir, 'packages/shared-service/src'),
  '@repo/design-tokens': resolve(rootDir, 'packages/design-tokens/src'),
  '@repo/shared-workflow': resolve(rootDir, 'packages/shared-workflow/src'),
} as const

export const appAliasEntries = {
  '@': resolve(__dirname, 'src'),
} as const

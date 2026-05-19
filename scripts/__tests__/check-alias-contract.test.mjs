import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

import {
  collectAliasContractIssues,
  createAliasContractExpectation,
  extractAliasEntriesFromText,
} from '../check-alias-contract.mjs'

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

test('extractAliasEntriesFromText reads shared aliases from app paths.config.ts', () => {
  const aliasEntries = extractAliasEntriesFromText(`
import { resolve } from 'node:path'

export const sharedPackageAliases = {
  '@repo/shared-ui': resolve(rootDir, 'packages/shared-ui/src'),
  '@repo/shared-i18n': resolve(rootDir, 'packages/shared-i18n/src'),
}
`)

  assert.deepEqual(aliasEntries, [
    { find: '@repo/shared-ui', target: 'packages/shared-ui/src' },
    { find: '@repo/shared-i18n', target: 'packages/shared-i18n/src' },
  ])
})

test('collectAliasContractIssues reports missing and unexpected tsconfig path mappings', () => {
  const issues = collectAliasContractIssues({
    aliasEntries: [
      { find: '@repo/shared-ui', target: 'packages/shared-ui/src' },
      { find: '@repo/shared-service', target: 'packages/shared-service/src' },
    ],
    appDir: join(realpathSync('.'), 'apps', 'vue3-app'),
    tsconfigPaths: {
      '@repo/shared-ui': ['../../packages/shared-ui/src'],
      '@repo/shared-ui/*': ['../../packages/shared-ui/src/*'],
      '@repo/unexpected': ['../../packages/unexpected/src'],
    },
  })

  assert.equal(issues.length, 3)
  assert.match(issues[0], /Missing tsconfig path mapping for "@repo\/shared-service"/)
  assert.match(issues[1], /Missing tsconfig path mapping for "@repo\/shared-service\/\*"/)
  assert.match(issues[2], /Unexpected shared tsconfig path mapping "@repo\/unexpected"/)
})

test('check-alias contract expects app tsconfig paths relative to the app directory', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-check-alias-'))
  const pathsConfig = join(workspaceRoot, 'apps', 'vue3-app', 'paths.config.ts')

  writeFile(
    pathsConfig,
    [
      "import { resolve } from 'node:path'",
      '',
      "const rootDir = resolve(__dirname, '../..')",
      '',
      'export const sharedPackageAliases = {',
      "  '@repo/shared-ui': resolve(rootDir, 'packages/shared-ui/src'),",
      "  '@repo/shared-i18n': resolve(rootDir, 'packages/shared-i18n/src'),",
      '}',
      '',
    ].join('\n'),
  )

  const aliasEntries = extractAliasEntriesFromText(
    [
      "export const sharedPackageAliases = {",
      "  '@repo/shared-ui': resolve(rootDir, 'packages/shared-ui/src'),",
      "  '@repo/shared-i18n': resolve(rootDir, 'packages/shared-i18n/src'),",
      '}',
      '',
    ].join('\n'),
  )

  const issues = collectAliasContractIssues({
    aliasEntries,
    appDir: join(workspaceRoot, 'apps', 'vue3-app'),
    tsconfigPaths: {
      '@repo/shared-ui': ['../../packages/shared-ui/src'],
      '@repo/shared-ui/*': ['../../packages/shared-ui/src/*'],
      '@repo/shared-i18n': ['../../packages/shared-i18n/src'],
      '@repo/shared-i18n/*': ['../../packages/shared-i18n/src/*'],
    },
  })

  assert.deepEqual(issues, [])
})

test('createAliasContractExpectation normalizes package targets relative to the app directory', () => {
  const expectation = createAliasContractExpectation(
    [{ find: '@repo/design-tokens', target: 'packages/design-tokens/src' }],
    join(realpathSync('.'), 'apps', 'vue3-app'),
  )

  assert.deepEqual(expectation, {
    '@repo/design-tokens': ['../../packages/design-tokens/src'],
    '@repo/design-tokens/*': ['../../packages/design-tokens/src/*'],
  })
})

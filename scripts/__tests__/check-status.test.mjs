import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

import { checkStatusConsistency } from '../check-status.mjs'

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

function createWorkspaceRoot() {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-check-status-'))

  for (const appName of ['vue3-app']) {
    mkdirSync(join(workspaceRoot, 'apps', appName), { recursive: true })
  }

  for (const packageName of [
    'design-tokens',
    'shared-utils',
    'shared-i18n',
    'shared-service',
    'shared-ui',
    'shared-workflow',
  ]) {
    mkdirSync(join(workspaceRoot, 'packages', packageName), { recursive: true })
  }

  writeFile(
    join(workspaceRoot, 'STATUS.yaml'),
    [
      'version: 1',
      'updated_at: 2026-05-17',
      'apps:',
      '  vue3-app:',
      '    status: stable',
      'packages:',
      '  design-tokens:',
      '    status: stable',
      '  shared-utils:',
      '    status: stable',
      '  shared-i18n:',
      '    status: stable',
      '  shared-service:',
      '    status: stable',
      '  shared-ui:',
      '    status: stable',
      '  shared-workflow:',
      '    status: stable',
      '',
    ].join('\n'),
  )

  writeFile(
    join(workspaceRoot, 'package.json'),
    JSON.stringify(
      {
        scripts: {
          build: 'pnpm build:shared && pnpm --filter @repo/vue3-app build',
          'build:shared':
            'pnpm --filter @repo/shared-utils build && pnpm --filter @repo/shared-i18n build && pnpm --filter @repo/shared-service build && pnpm --filter @repo/design-tokens build && pnpm --filter @repo/shared-ui build && pnpm --filter @repo/shared-workflow build',
          'build:vue': 'pnpm build:shared && pnpm -F @repo/vue3-app build',
          typecheck:
            'pnpm --filter @repo/shared-utils typecheck && pnpm --filter @repo/shared-i18n typecheck && pnpm --filter @repo/shared-service typecheck && pnpm --filter @repo/design-tokens typecheck && pnpm --filter @repo/shared-ui typecheck && pnpm --filter @repo/shared-workflow typecheck && pnpm --filter @repo/vue3-app typecheck',
          test: 'pnpm --filter @repo/shared-utils test && pnpm --filter @repo/shared-i18n test && pnpm --filter @repo/shared-service test && pnpm --filter @repo/design-tokens test && pnpm --filter @repo/shared-ui test && pnpm --filter @repo/shared-workflow test && pnpm --filter @repo/vue3-app test',
          'test:coverage':
            'pnpm --filter @repo/shared-utils test:coverage && pnpm --filter @repo/shared-i18n test:coverage && pnpm --filter @repo/shared-service test:coverage && pnpm --filter @repo/design-tokens test:coverage && pnpm --filter @repo/shared-ui test:coverage && pnpm --filter @repo/shared-workflow test:coverage && pnpm --filter @repo/vue3-app test:coverage',
          'test:scripts': 'node --test "scripts/__tests__/*.test.mjs"',
          verify: 'pnpm check:status && pnpm test:scripts',
        },
      },
      null,
      2,
    ),
  )

  writeFile(
    join(workspaceRoot, 'vitest.config.ts'),
    [
      "import { defineConfig } from 'vitest/config'",
      '',
      'export default defineConfig({',
      '  test: {',
      '    projects: [',
      "      'packages/shared-utils/vitest.config.ts',",
      "      'packages/shared-i18n/vitest.config.ts',",
      "      'packages/shared-service/vitest.config.ts',",
      "      'packages/design-tokens/vitest.config.ts',",
      "      'packages/shared-ui/vitest.config.ts',",
      "      'packages/shared-workflow/vitest.config.ts',",
      "      'apps/vue3-app/vitest.config.ts',",
      '    ],',
      '  },',
      '})',
      '',
    ].join('\n'),
  )

  return workspaceRoot
}

test('checkStatusConsistency passes when STATUS.yaml matches the current root contract', () => {
  const workspaceRoot = createWorkspaceRoot()
  assert.doesNotThrow(() => checkStatusConsistency(workspaceRoot))
})

test('checkStatusConsistency fails when an experimental app leaks into the root test matrix', () => {
  const workspaceRoot = createWorkspaceRoot()
  mkdirSync(join(workspaceRoot, 'apps', 'experimental-app'), { recursive: true })
  writeFile(
    join(workspaceRoot, 'STATUS.yaml'),
    [
      'version: 1',
      'updated_at: 2026-05-17',
      'apps:',
      '  vue3-app:',
      '    status: stable',
      '  experimental-app:',
      '    status: experimental',
      'packages:',
      '  design-tokens:',
      '    status: stable',
      '  shared-utils:',
      '    status: stable',
      '  shared-i18n:',
      '    status: stable',
      '  shared-service:',
      '    status: stable',
      '  shared-ui:',
      '    status: stable',
      '  shared-workflow:',
      '    status: stable',
      '',
    ].join('\n'),
  )
  writeFile(
    join(workspaceRoot, 'vitest.config.ts'),
    [
      "import { defineConfig } from 'vitest/config'",
      '',
      'export default defineConfig({',
      '  test: {',
      '    projects: [',
      "      'packages/shared-utils/vitest.config.ts',",
      "      'packages/shared-i18n/vitest.config.ts',",
      "      'packages/shared-service/vitest.config.ts',",
      "      'packages/design-tokens/vitest.config.ts',",
      "      'packages/shared-ui/vitest.config.ts',",
      "      'packages/shared-workflow/vitest.config.ts',",
      "      'apps/vue3-app/vitest.config.ts',",
      "      'apps/experimental-app/vitest.config.ts',",
      '    ],',
      '  },',
      '})',
      '',
    ].join('\n'),
  )

  assert.throws(
    () => checkStatusConsistency(workspaceRoot),
    /must not be in the root vitest matrix|Experimental apps in STATUS.yaml mismatch/,
  )
})

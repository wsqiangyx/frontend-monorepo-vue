import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from 'eslint-config-prettier'

const vueFiles = [
  'apps/vue3-*/**/*.{ts,vue}',
  'packages/shared-ui/**/*.{ts,vue}',
  'packages/shared-workflow/**/*.{ts,vue}',
]

export default defineConfig(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/coverage/**', '**/.vitest/**', '**/*.cjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: vueFiles,
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['apps/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/packages/*/src/*', '**/packages/*/dist/*'],
              message: 'Consume shared packages through workspace aliases or package exports.',
            },
          ],
        },
      ],
    },
  },
  configPrettier,
)

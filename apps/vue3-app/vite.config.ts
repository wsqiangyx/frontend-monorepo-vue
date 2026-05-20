import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { appAliasEntries, sharedPackageAliases } from './paths.config'

export default defineConfig(({ mode }) => {
  const { VITE_PROXY_TARGET, VITE_API_BASE_URL } = loadEnv(mode, process.cwd(), '')

  const proxy =
    VITE_PROXY_TARGET && VITE_API_BASE_URL
      ? {
          [VITE_API_BASE_URL]: {
            target: VITE_PROXY_TARGET,
            changeOrigin: true,
          },
        }
      : undefined

  return {
    plugins: [vue(), UnoCSS()],
    resolve: {
      alias: {
        ...appAliasEntries,
        ...sharedPackageAliases,
      },
    },
    server: {
      port: 3000,
      proxy,
    },
  }
})

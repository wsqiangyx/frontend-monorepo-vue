import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { appAliasEntries, sharedPackageAliases } from './paths.config'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      ...appAliasEntries,
      ...sharedPackageAliases,
    },
  },
  server: {
    port: 3000,
  },
})

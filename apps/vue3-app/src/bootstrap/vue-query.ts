// ============================================================================
// Vue Query 客户端配置
// ============================================================================
// TanStack Vue Query 管理服务端状态（API 数据获取、缓存、同步、乐观更新）。
// Pinia 仅保留客户端 UI 状态（侧边栏折叠、主题偏好、表单草稿等）。
// ============================================================================
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

/**
 * 企业级 QueryClient 配置。
 *
 * - staleTime: 数据"新鲜"时长，此期间内不会重新请求（5 分钟）
 * - gcTime:    数据在缓存中保留时长，超时后自动回收（30 分钟）
 * - retry:     失败重试次数（3 次），对 4xx 错误不重试
 * - refetchOnWindowFocus: 窗口聚焦时是否自动刷新（生产环境关闭，避免干扰）
 */
export const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 min
        gcTime: 30 * 60 * 1000, // 30 min
        retry: (failureCount, error) => {
          // 4xx 客户端错误不重试
          if (
            error instanceof Error &&
            'response' in error &&
            (error as { response?: { status?: number } }).response?.status != null &&
            (error as { response?: { status?: number } }).response!.status! >= 400 &&
            (error as { response?: { status?: number } }).response!.status! < 500
          ) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: import.meta.env.PROD ? false : true,
      },
      mutations: {
        retry: false,
      },
    },
  },
}

/**
 * 注册 Vue Query 插件，供 bootstrap 链调用。
 */
export function setupVueQuery() {
  return {
    plugin: VueQueryPlugin,
    options: vueQueryPluginOptions,
  }
}

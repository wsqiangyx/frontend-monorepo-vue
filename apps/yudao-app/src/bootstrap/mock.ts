export async function setupMock() {
  if (import.meta.env.DEV !== true) {
    return
  }

  // 开发环境默认启用 mock，显式设置 VITE_ENABLE_MSW=false 可关闭以对接真实后端
  if (import.meta.env.VITE_ENABLE_MSW === 'false') {
    return
  }

  const { worker } = await import('@repo/shared-service/mock/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

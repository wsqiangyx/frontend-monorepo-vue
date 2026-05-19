export async function setupMock() {
  if (import.meta.env.DEV !== true || import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return
  }

  const { worker } = await import('@repo/shared-service/mock/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

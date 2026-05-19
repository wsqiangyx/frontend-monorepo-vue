export function validateEnv() {
  const { VITE_API_BASE_URL, VITE_PROXY_TARGET } = import.meta.env

  if (!VITE_API_BASE_URL) {
    throw new Error('Missing required env: VITE_API_BASE_URL')
  }

  if (!VITE_PROXY_TARGET) {
    throw new Error('Missing required env: VITE_PROXY_TARGET')
  }
}

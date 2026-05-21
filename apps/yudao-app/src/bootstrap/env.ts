export function validateEnv() {
  const { VITE_API_BASE_URL, VITE_APP_TITLE } = import.meta.env

  if (!VITE_API_BASE_URL) {
    throw new Error('Missing required env: VITE_API_BASE_URL')
  }

  if (!VITE_APP_TITLE) {
    throw new Error('Missing required env: VITE_APP_TITLE')
  }
}

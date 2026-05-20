export function validateEnv() {
  const { VITE_API_BASE_URL } = import.meta.env

  if (!VITE_API_BASE_URL) {
    throw new Error('Missing required env: VITE_API_BASE_URL')
  }
}

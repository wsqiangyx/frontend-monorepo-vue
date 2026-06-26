// ============================================================================
// @repo/shared-utils -- HTTP Client barrel export
// ============================================================================
export type {
  HttpClient,
  RequestConfig,
  UploadConfig,
  UploadProgress,
  UploadProgressCallback,
} from './types'
export { createKyHttpClient } from './ky-adapter'
export { uploadWithProgress } from './upload'

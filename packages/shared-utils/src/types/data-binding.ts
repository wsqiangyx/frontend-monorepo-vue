/** 数据绑定状态 */
export type DataBindingStatus = 'idle' | 'loading' | 'success' | 'error'

/** 数据绑定配置 */
export interface DataBinding {
  dataSourceId: string
  fieldMapping?: Record<string, string>
}

/** 数据结果元信息 */
export interface DataResultMeta {
  source: string
  updatedAt: string
}

/** 数据绑定解析结果 */
export interface DataResult {
  status: DataBindingStatus
  data: unknown
  error?: string
  meta?: DataResultMeta
}

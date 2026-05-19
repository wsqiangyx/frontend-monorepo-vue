/** Phase 1 支持的数据源类型 */
export type DataSourceType = 'mock' | 'static'

/** Mock 数据源配置 */
export interface MockDataSourceConfig {
  endpoint: string
}

/** 静态数据源配置 */
export interface StaticDataSourceConfig {
  data: unknown
}

/** 数据源定义 */
export interface DataSource {
  id: string
  type: DataSourceType
  name: string
  config: MockDataSourceConfig | StaticDataSourceConfig
}

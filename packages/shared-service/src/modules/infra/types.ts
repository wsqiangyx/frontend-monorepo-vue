// ============================================================================
// 基础设施模块类型定义
// ============================================================================

// --- 代码生成 ---
export interface CodegenTableVO {
  id: number
  tableId: number
  dataSourceConfigId: number
  scene: number
  tableName: string
  tableComment: string
  remark: string
  moduleName: string
  businessName: string
  className: string
  classComment: string
  author: string
  templateType: number
  parentMenuId: number
  createTime: string
  updateTime: string
}

export interface CodegenColumnVO {
  id: number
  tableId: number
  columnName: string
  dataType: string
  columnComment: string
  nullable: number
  primaryKey: number
  ordinalPosition: number
  javaType: string
  javaField: string
  dictType: string
  example: string
  createOperation: number
  updateOperation: number
  listOperation: number
  listOperationCondition: string
  listOperationResult: number
  htmlType: string
}

export interface DatabaseTableVO {
  name: string
  comment: string
}

export interface CodegenPreviewVO {
  filePath: string
  code: string
}

export interface CodegenUpdateReqVO {
  table: Partial<CodegenTableVO>
  columns: CodegenColumnVO[]
}

export interface DataSourceConfigVO {
  id: number
  name: string
  username: string
  url: string
  createTime: string
}

// --- 文件管理 ---
export interface FileVO {
  id: number
  name: string
  path: string
  url: string
  size: number
  type: string
  createTime: string
}

export interface FileConfigVO {
  id: number
  name: string
  storage: string
  master: boolean
  config: Record<string, string>
  remark: string
  createTime: string
}

// --- 定时任务 ---
export interface JobVO {
  id: number
  name: string
  status: number
  handlerName: string
  handlerParam: string
  cronExpression: string
  retryCount: number
  retryInterval: number
  monitorTimeout: number
  createTime: string
}

export interface JobLogVO {
  id: number
  jobId: number
  handlerName: string
  handlerParam: string
  cronExpression: string
  executeIndex: number
  beginTime: string
  endTime: string
  duration: number
  status: number
  result: string
  createTime: string
}

// --- 配置管理 ---
export interface ConfigVO {
  id: number
  category: string
  name: string
  key: string
  value: string
  visible: boolean
  type: number
  remark: string
  createTime: string
}

// --- Redis 监控 ---
export interface RedisInfoVO {
  redis_version: string
  redis_mode: string
  tcp_port: string
  connected_clients: string
  uptime_in_days: string
  used_memory_human: string
  used_cpu_user_children: string
  maxmemory_human: string
  aof_enabled: string
  rdb_last_bgsave_status: string
  instantaneous_input_kbps: string
  instantaneous_output_kbps: string
}

export interface RedisMonitorInfoVO {
  info: RedisInfoVO
  dbSize: number
  commandStats: Array<{ command: string; calls: number }>
}

export interface RedisKeyVO {
  key: string
  ttl: number
  type: string
  value: string
}

// --- API 访问日志 ---
export interface ApiAccessLogVO {
  id: number
  userId: number
  userType: number
  applicationName: string
  requestMethod: string
  requestUrl: string
  beginTime: string
  endTime: string
  duration: number
  resultCode: number
  resultMsg: string
  operateModule: string
  operateName: string
  operateType: number
  userIp: string
  userAgent: string
}

// --- API 错误日志 ---
export interface ApiErrorLogVO {
  id: number
  userId: number
  userType: number
  applicationName: string
  requestMethod: string
  requestUrl: string
  exceptionName: string
  exceptionMessage: string
  exceptionStackTrace: string
  exceptionTime: string
  processStatus: number
  processTime: string
  processUserId: number
  resultCode: number
  resultMsg: string
  userIp: string
  userAgent: string
  createTime: string
}

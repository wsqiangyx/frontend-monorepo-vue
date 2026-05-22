// ============================================================================
// 代码生成 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type {
  CodegenTableVO,
  CodegenColumnVO,
  CodegenPreviewVO,
  CodegenUpdateReqVO,
  DatabaseTableVO,
  DataSourceConfigVO,
} from './types'

export function createCodegenApi(http: AxiosInstance) {
  return {
    /** 查询代码生成表分页 */
    getPage(params: {
      pageNo: number
      pageSize: number
      tableName?: string
      tableComment?: string
    }) {
      return http.get<{ data: { list: CodegenTableVO[]; total: number } }>(
        '/infra/codegen/table/page',
        { params },
      )
    },
    /** 查询代码生成表列表 */
    getList(dataSourceConfigId: number) {
      return http.get<{ data: CodegenTableVO[] }>('/infra/codegen/table/list', {
        params: { dataSourceConfigId },
      })
    },
    /** 查询详情 */
    getDetail(tableId: number) {
      return http.get<{ data: { table: CodegenTableVO; columns: CodegenColumnVO[] } }>(
        '/infra/codegen/detail',
        { params: { tableId } },
      )
    },
    /** 修改代码生成表定义 */
    update(data: CodegenUpdateReqVO) {
      return http.put('/infra/codegen/update', data)
    },
    /** 同步数据库表结构 */
    syncFromDB(tableId: number) {
      return http.put('/infra/codegen/sync-from-db', null, { params: { tableId } })
    },
    /** 预览生成代码 */
    preview(tableId: number) {
      return http.get<{ data: CodegenPreviewVO[] }>('/infra/codegen/preview', {
        params: { tableId },
      })
    },
    /** 下载生成代码 */
    download(tableId: number) {
      return http.get('/infra/codegen/download', { params: { tableId }, responseType: 'blob' })
    },
    /** 获取数据库表列表 */
    getSchemaTableList(params: { name?: string; comment?: string; dataSourceConfigId?: number }) {
      return http.get<{ data: DatabaseTableVO[] }>('/infra/codegen/db/table/list', { params })
    },
    /** 导入表 */
    createList(data: { dataSourceConfigId: number; tableNames: string[] }) {
      return http.post('/infra/codegen/create-list', data)
    },
    /** 删除代码生成表定义 */
    delete(tableId: number) {
      return http.delete('/infra/codegen/delete', { params: { tableId } })
    },
    /** 批量删除 */
    deleteList(tableIds: number[]) {
      return http.delete('/infra/codegen/delete-list', { params: { tableIds: tableIds.join(',') } })
    },
  }
}

export function createDataSourceConfigApi(http: AxiosInstance) {
  return {
    /** 获取数据源配置列表 */
    getList() {
      return http.get<{ data: DataSourceConfigVO[] }>('/infra/data-source-config/list')
    },
  }
}

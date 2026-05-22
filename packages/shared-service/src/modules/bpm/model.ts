// ============================================================================
// 流程模型 API
// ============================================================================
import type { AxiosInstance } from 'axios'
import type { ModelVO } from './types'

export function createModelApi(http: AxiosInstance) {
  return {
    /** 获取模型列表 */
    getList(name?: string) {
      return http.get<{ data: ModelVO[] }>('/bpm/model/list', { params: { name } })
    },
    /** 获取模型详情 */
    get(id: number) {
      return http.get<{ data: ModelVO }>('/bpm/model/get', { params: { id } })
    },
    /** 创建模型 */
    create(data: Partial<ModelVO>) {
      return http.post('/bpm/model/create', data)
    },
    /** 修改模型 */
    update(data: Partial<ModelVO>) {
      return http.put('/bpm/model/update', data)
    },
    /** 修改模型 BPMN */
    updateBpmn(data: Partial<ModelVO>) {
      return http.put('/bpm/model/update-bpmn', data)
    },
    /** 修改模型状态 */
    updateState(id: number, state: number) {
      return http.put('/bpm/model/update-state', { id, state })
    },
    /** 删除模型 */
    delete(id: number) {
      return http.delete('/bpm/model/delete', { params: { id } })
    },
    /** 部署模型 */
    deploy(id: number) {
      return http.post('/bpm/model/deploy', null, { params: { id } })
    },
    /** 清理模型 */
    clean(id: number) {
      return http.delete('/bpm/model/clean', { params: { id } })
    },
  }
}

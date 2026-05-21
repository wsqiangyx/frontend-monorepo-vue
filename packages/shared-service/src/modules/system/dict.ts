// ============================================================================
// 字典管理 API
// ============================================================================

import type { AxiosInstance } from 'axios'
import type { DictTypeVO, DictDataVO, PageResult } from './types'

export function createDictTypeApi(http: AxiosInstance) {
  return {
    /** 字典类型分页列表 */
    getPage(params: { pageNo: number; pageSize: number; name?: string; status?: number }) {
      return http.get<PageResult<DictTypeVO>>('/system/dict-type/page', { params })
    },

    /** 字典类型简单列表 */
    getSimpleList() {
      return http.get<DictTypeVO[]>('/system/dict-type/simple-list')
    },

    /** 获取字典类型详情 */
    get(id: number) {
      return http.get<DictTypeVO>('/system/dict-type/get', { params: { id } })
    },

    /** 新增字典类型 */
    create(data: Partial<DictTypeVO>) {
      return http.post('/system/dict-type/create', data)
    },

    /** 修改字典类型 */
    update(data: Partial<DictTypeVO>) {
      return http.put('/system/dict-type/update', data)
    },

    /** 删除字典类型 */
    delete(id: number) {
      return http.delete('/system/dict-type/delete', { params: { id } })
    },
  }
}

export function createDictDataApi(http: AxiosInstance) {
  return {
    /** 字典数据列表 */
    getList(dictType: string) {
      return http.get<DictDataVO[]>('/system/dict-data/list', {
        params: { dictType },
      })
    },

    /** 获取字典数据详情 */
    get(id: number) {
      return http.get<DictDataVO>('/system/dict-data/get', { params: { id } })
    },

    /** 新增字典数据 */
    create(data: Partial<DictDataVO>) {
      return http.post('/system/dict-data/create', data)
    },

    /** 修改字典数据 */
    update(data: Partial<DictDataVO>) {
      return http.put('/system/dict-data/update', data)
    },

    /** 删除字典数据 */
    delete(id: number) {
      return http.delete('/system/dict-data/delete', { params: { id } })
    },
  }
}

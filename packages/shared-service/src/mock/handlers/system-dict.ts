// ============================================================================
// 字典管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockDictTypes = [
  {
    id: 1,
    name: '用户性别',
    type: 'system_user_sex',
    status: 0,
    remark: '用户性别字典',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    name: '系统状态',
    type: 'common_status',
    status: 0,
    remark: '系统开关',
    createTime: '2026-01-01',
  },
  {
    id: 3,
    name: '菜单类型',
    type: 'system_menu_type',
    status: 0,
    remark: '菜单类型',
    createTime: '2026-01-01',
  },
]

const mockDictData = [
  {
    id: 1,
    sort: 1,
    label: '男',
    value: '0',
    dictType: 'system_user_sex',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    sort: 2,
    label: '女',
    value: '1',
    dictType: 'system_user_sex',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 3,
    sort: 1,
    label: '开启',
    value: '0',
    dictType: 'common_status',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 4,
    sort: 2,
    label: '关闭',
    value: '1',
    dictType: 'common_status',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 5,
    sort: 1,
    label: '目录',
    value: '1',
    dictType: 'system_menu_type',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 6,
    sort: 2,
    label: '菜单',
    value: '2',
    dictType: 'system_menu_type',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 7,
    sort: 3,
    label: '按钮',
    value: '3',
    dictType: 'system_menu_type',
    status: 0,
    remark: '',
    createTime: '2026-01-01',
  },
]

let nextTypeId = 4
let nextDataId = 8

export const systemDictHandlers = [
  // 字典类型分页
  http.get('*/system/dict-type/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockDictTypes, mockDictTypes.length, pageNo, pageSize))
  }),

  // 字典类型简单列表
  http.get('*/system/dict-type/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockDictTypes))
  }),

  // 字典类型 CRUD
  http.post('*/system/dict-type/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const dictType = {
      id: nextTypeId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockDictTypes)[0]
    mockDictTypes.push(dictType)
    return HttpResponse.json(success(dictType))
  }),

  http.put('*/system/dict-type/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockDictTypes.findIndex((d) => d.id === body.id)
    if (index !== -1) Object.assign(mockDictTypes[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/dict-type/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockDictTypes.findIndex((d) => d.id === id)
    if (index !== -1) mockDictTypes.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 字典数据列表
  http.get('*/system/dict-data/list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const dictType = url.searchParams.get('dictType') ?? ''
    const filtered = mockDictData.filter((d) => d.dictType === dictType)
    return HttpResponse.json(success(filtered))
  }),

  // 字典数据 CRUD
  http.post('*/system/dict-data/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const data = {
      id: nextDataId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as (typeof mockDictData)[0]
    mockDictData.push(data)
    return HttpResponse.json(success(data))
  }),

  http.put('*/system/dict-data/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const index = mockDictData.findIndex((d) => d.id === body.id)
    if (index !== -1) Object.assign(mockDictData[index], body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/dict-data/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockDictData.findIndex((d) => d.id === id)
    if (index !== -1) mockDictData.splice(index, 1)
    return HttpResponse.json(success(true))
  }),
]

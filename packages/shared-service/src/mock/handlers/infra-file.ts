// ============================================================================
// 文件管理 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockFiles = [
  {
    id: 1,
    name: 'logo.png',
    path: '/images/logo.png',
    url: 'https://via.placeholder.com/200x200?text=Logo',
    size: 25600,
    type: 'image/png',
    createTime: '2026-03-01',
  },
  {
    id: 2,
    name: 'avatar.jpg',
    path: '/images/avatar.jpg',
    url: 'https://via.placeholder.com/100x100?text=Avatar',
    size: 51200,
    type: 'image/jpeg',
    createTime: '2026-03-05',
  },
  {
    id: 3,
    name: 'report.pdf',
    path: '/docs/report.pdf',
    url: '/files/report.pdf',
    size: 1048576,
    type: 'application/pdf',
    createTime: '2026-03-10',
  },
  {
    id: 4,
    name: 'import.xlsx',
    path: '/docs/import.xlsx',
    url: '/files/import.xlsx',
    size: 204800,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createTime: '2026-04-01',
  },
  {
    id: 5,
    name: 'banner.png',
    path: '/images/banner.png',
    url: 'https://via.placeholder.com/800x200?text=Banner',
    size: 153600,
    type: 'image/png',
    createTime: '2026-04-15',
  },
  {
    id: 6,
    name: 'manual.docx',
    path: '/docs/manual.docx',
    url: '/files/manual.docx',
    size: 524288,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createTime: '2026-05-01',
  },
]

export const infraFileHandlers = [
  // 文件分页
  http.get('*/infra/file/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const path = url.searchParams.get('path')
    const type = url.searchParams.get('type')

    let filtered = [...mockFiles]
    if (path) filtered = filtered.filter((f) => f.path.includes(path))
    if (type) filtered = filtered.filter((f) => f.type.includes(type))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 删除文件
  http.delete('*/infra/file/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const index = mockFiles.findIndex((f) => f.id === id)
    if (index !== -1) mockFiles.splice(index, 1)
    return HttpResponse.json(success(true))
  }),

  // 批量删除
  http.delete('*/infra/file/delete-list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const ids = url.searchParams.get('ids')?.split(',').map(Number) ?? []
    for (const id of ids) {
      const index = mockFiles.findIndex((f) => f.id === id)
      if (index !== -1) mockFiles.splice(index, 1)
    }
    return HttpResponse.json(success(true))
  }),
]

// --- 文件配置 Mock ---
const mockFileConfigs = [
  {
    id: 1,
    name: '本地存储',
    storage: 'local',
    master: true,
    endpoint: '',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '',
    createTime: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '阿里云 OSS',
    storage: 'alibaba-oss',
    master: false,
    endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    accessKeyId: 'LTAI****',
    accessKeySecret: '****',
    bucket: 'my-bucket',
    createTime: '2024-01-15 10:00:00',
  },
]

let nextFileConfigId = 3

export const infraFileConfigHandlers = [
  http.get('*/infra/file-config/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockFileConfigs, mockFileConfigs.length, pageNo, pageSize))
  }),

  http.get('*/infra/file-config/get', async ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const config = mockFileConfigs.find((c) => c.id === id)
    return HttpResponse.json(success(config ?? null))
  }),

  http.post('*/infra/file-config/create', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    mockFileConfigs.push({ id: nextFileConfigId++, ...body } as Record<string, unknown>)
    return HttpResponse.json(success(null))
  }),

  http.put('*/infra/file-config/update', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const idx = mockFileConfigs.findIndex((c) => c.id === body.id)
    if (idx >= 0) Object.assign(mockFileConfigs[idx], body)
    return HttpResponse.json(success(null))
  }),

  http.delete('*/infra/file-config/delete', async ({ request }) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const idx = mockFileConfigs.findIndex((c) => c.id === id)
    if (idx >= 0) mockFileConfigs.splice(idx, 1)
    return HttpResponse.json(success(null))
  }),

  http.put('*/infra/file-config/update-master', async ({ request }) => {
    const body = (await request.json()) as { id: number }
    mockFileConfigs.forEach((c) => (c.master = c.id === body.id))
    return HttpResponse.json(success(null))
  }),

  http.get('*/infra/file-config/get-default', async () => {
    const config = mockFileConfigs.find((c) => c.master) ?? mockFileConfigs[0]
    return HttpResponse.json(success(config))
  }),
]

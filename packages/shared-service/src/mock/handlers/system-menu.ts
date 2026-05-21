// ============================================================================
// 菜单管理 Mock Handlers
// ============================================================================

import { http, HttpResponse, delay } from 'msw'
import { success } from '../helpers'

interface MockMenu {
  id: number
  name: string
  parentId: number
  type: number
  sort: number
  path: string
  icon: string
  component: string
  permission: string
  status: number
  createTime: string
  children?: MockMenu[]
}

const mockMenus: MockMenu[] = [
  {
    id: 1,
    name: '系统管理',
    parentId: 0,
    type: 1,
    sort: 10,
    path: '/system',
    icon: 'setting',
    component: '',
    permission: '',
    status: 0,
    createTime: '2026-01-01',
    children: [
      {
        id: 2,
        name: '用户管理',
        parentId: 1,
        type: 2,
        sort: 1,
        path: 'user',
        icon: 'user',
        component: 'system/user/index',
        permission: 'system:user:list',
        status: 0,
        createTime: '2026-01-01',
      },
      {
        id: 3,
        name: '角色管理',
        parentId: 1,
        type: 2,
        sort: 2,
        path: 'role',
        icon: 'usergroup',
        component: 'system/role/index',
        permission: 'system:role:list',
        status: 0,
        createTime: '2026-01-01',
      },
      {
        id: 4,
        name: '菜单管理',
        parentId: 1,
        type: 2,
        sort: 3,
        path: 'menu',
        icon: 'list',
        component: 'system/menu/index',
        permission: 'system:menu:list',
        status: 0,
        createTime: '2026-01-01',
      },
      {
        id: 5,
        name: '部门管理',
        parentId: 1,
        type: 2,
        sort: 4,
        path: 'dept',
        icon: 'organization',
        component: 'system/dept/index',
        permission: 'system:dept:list',
        status: 0,
        createTime: '2026-01-01',
      },
      {
        id: 6,
        name: '岗位管理',
        parentId: 1,
        type: 2,
        sort: 5,
        path: 'post',
        icon: 'bookmark',
        component: 'system/post/index',
        permission: 'system:post:list',
        status: 0,
        createTime: '2026-01-01',
      },
      {
        id: 7,
        name: '字典管理',
        parentId: 1,
        type: 2,
        sort: 6,
        path: 'dict',
        icon: 'file',
        component: 'system/dict/index',
        permission: 'system:dict:list',
        status: 0,
        createTime: '2026-01-01',
      },
    ],
  },
  {
    id: 10,
    name: '基础设施',
    parentId: 0,
    type: 1,
    sort: 20,
    path: '/infra',
    icon: 'server',
    component: '',
    permission: '',
    status: 0,
    createTime: '2026-01-01',
    children: [],
  },
]

let nextId = 20

export const systemMenuHandlers = [
  http.get('*/system/menu/list', async () => {
    await delay(200)
    return HttpResponse.json(success(mockMenus))
  }),

  http.get('*/system/menu/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const menu = findMenu(mockMenus, id)
    if (!menu)
      return HttpResponse.json(
        { success: false, code: '404', message: '菜单不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(menu))
  }),

  http.post('*/system/menu/create', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const menu: MockMenu = {
      id: nextId++,
      ...body,
      createTime: new Date().toISOString().slice(0, 10),
    } as MockMenu
    mockMenus.push(menu)
    return HttpResponse.json(success(menu))
  }),

  http.put('*/system/menu/update', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Record<string, unknown>
    const menu = findMenu(mockMenus, body.id as number)
    if (menu) Object.assign(menu, body)
    return HttpResponse.json(success(true))
  }),

  http.delete('*/system/menu/delete', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    removeMenu(mockMenus, id)
    return HttpResponse.json(success(true))
  }),
]

function findMenu(menus: MockMenu[], id: number): MockMenu | undefined {
  for (const menu of menus) {
    if (menu.id === id) return menu
    if (menu.children?.length) {
      const found = findMenu(menu.children, id)
      if (found) return found
    }
  }
  return undefined
}

function removeMenu(menus: MockMenu[], id: number): boolean {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].id === id) {
      menus.splice(i, 1)
      return true
    }
    if (menus[i].children?.length) {
      if (removeMenu(menus[i].children!, id)) return true
    }
  }
  return false
}

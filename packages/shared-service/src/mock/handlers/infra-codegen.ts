// ============================================================================
// 代码生成 Mock Handlers
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

const mockTables = [
  {
    id: 1,
    tableId: 1,
    dataSourceConfigId: 0,
    scene: 1,
    tableName: 'system_user',
    tableComment: '用户表',
    remark: '',
    moduleName: 'system',
    businessName: 'user',
    className: 'SystemUser',
    classComment: '用户',
    author: 'yudao',
    templateType: 1,
    parentMenuId: 0,
    createTime: '2026-01-15',
    updateTime: '2026-03-20',
  },
  {
    id: 2,
    tableId: 2,
    dataSourceConfigId: 0,
    scene: 1,
    tableName: 'system_role',
    tableComment: '角色表',
    remark: '',
    moduleName: 'system',
    businessName: 'role',
    className: 'SystemRole',
    classComment: '角色',
    author: 'yudao',
    templateType: 1,
    parentMenuId: 0,
    createTime: '2026-01-15',
    updateTime: '2026-03-20',
  },
  {
    id: 3,
    tableId: 3,
    dataSourceConfigId: 0,
    scene: 1,
    tableName: 'system_menu',
    tableComment: '菜单权限表',
    remark: '',
    moduleName: 'system',
    businessName: 'menu',
    className: 'SystemMenu',
    classComment: '菜单权限',
    author: 'yudao',
    templateType: 1,
    parentMenuId: 0,
    createTime: '2026-01-15',
    updateTime: '2026-03-20',
  },
  {
    id: 4,
    tableId: 4,
    dataSourceConfigId: 0,
    scene: 1,
    tableName: 'infra_config',
    tableComment: '参数配置表',
    remark: '',
    moduleName: 'infra',
    businessName: 'config',
    className: 'InfraConfig',
    classComment: '参数配置',
    author: 'yudao',
    templateType: 1,
    parentMenuId: 0,
    createTime: '2026-02-01',
    updateTime: '2026-04-10',
  },
  {
    id: 5,
    tableId: 5,
    dataSourceConfigId: 0,
    scene: 1,
    tableName: 'infra_job',
    tableComment: '定时任务表',
    remark: '',
    moduleName: 'infra',
    businessName: 'job',
    className: 'InfraJob',
    classComment: '定时任务',
    author: 'yudao',
    templateType: 1,
    parentMenuId: 0,
    createTime: '2026-02-01',
    updateTime: '2026-04-10',
  },
]

const mockColumns: Record<number, Array<Record<string, unknown>>> = {
  1: [
    {
      id: 1,
      tableId: 1,
      columnName: 'id',
      dataType: 'bigint',
      columnComment: '用户编号',
      nullable: 0,
      primaryKey: 1,
      ordinalPosition: 1,
      javaType: 'Long',
      javaField: 'id',
      dictType: '',
      example: '1',
      createOperation: 0,
      updateOperation: 0,
      listOperation: 0,
      listOperationCondition: '=',
      listOperationResult: 1,
      htmlType: 'input',
    },
    {
      id: 2,
      tableId: 1,
      columnName: 'username',
      dataType: 'varchar',
      columnComment: '用户账号',
      nullable: 0,
      primaryKey: 0,
      ordinalPosition: 2,
      javaType: 'String',
      javaField: 'username',
      dictType: '',
      example: 'yudao',
      createOperation: 1,
      updateOperation: 0,
      listOperation: 1,
      listOperationCondition: '=',
      listOperationResult: 1,
      htmlType: 'input',
    },
    {
      id: 3,
      tableId: 1,
      columnName: 'nickname',
      dataType: 'varchar',
      columnComment: '用户昵称',
      nullable: 0,
      primaryKey: 0,
      ordinalPosition: 3,
      javaType: 'String',
      javaField: 'nickname',
      dictType: '',
      example: '芋道',
      createOperation: 1,
      updateOperation: 1,
      listOperation: 1,
      listOperationCondition: 'like',
      listOperationResult: 1,
      htmlType: 'input',
    },
  ],
}

const mockDataSourceConfigs = [
  {
    id: 0,
    name: '默认数据源',
    username: 'root',
    url: 'jdbc:mysql://127.0.0.1:3306/yudao',
    createTime: '2026-01-01',
  },
  {
    id: 1,
    name: '测试数据源',
    username: 'test',
    url: 'jdbc:mysql://127.0.0.1:3306/yudao_test',
    createTime: '2026-02-01',
  },
]

const mockDbTables = [
  { name: 'system_user', comment: '用户表' },
  { name: 'system_role', comment: '角色表' },
  { name: 'system_menu', comment: '菜单权限表' },
  { name: 'system_dept', comment: '部门表' },
  { name: 'system_post', comment: '岗位表' },
  { name: 'infra_config', comment: '参数配置表' },
  { name: 'infra_job', comment: '定时任务表' },
  { name: 'infra_file', comment: '文件表' },
]

export const infraCodegenHandlers = [
  // 代码生成表分页
  http.get('*/infra/codegen/table/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const tableName = url.searchParams.get('tableName')
    const tableComment = url.searchParams.get('tableComment')

    let filtered = [...mockTables]
    if (tableName) filtered = filtered.filter((t) => t.tableName.includes(tableName))
    if (tableComment) filtered = filtered.filter((t) => t.tableComment.includes(tableComment))

    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),

  // 代码生成表列表
  http.get('*/infra/codegen/table/list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockTables))
  }),

  // 详情
  http.get('*/infra/codegen/detail', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const tableId = Number(url.searchParams.get('tableId'))
    const table = mockTables.find((t) => t.id === tableId)
    const columns = mockColumns[tableId] ?? mockColumns[1]
    return HttpResponse.json(success({ table, columns }))
  }),

  // 修改
  http.put('*/infra/codegen/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // 同步
  http.put('*/infra/codegen/sync-from-db', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),

  // 预览
  http.get('*/infra/codegen/preview', async () => {
    await delay(200)
    const preview = [
      {
        filePath: 'java/controller/SystemUserController.java',
        code: '@RestController\n@RequestMapping("/system/user")\npublic class SystemUserController {\n\n    @Resource\n    private SystemUserService userService;\n\n    @GetMapping("/page")\n    public CommonResult<PageResult<SystemUserVO>> page(SystemUserPageReqVO reqVO) {\n        return success(userService.page(reqVO));\n    }\n}',
      },
      {
        filePath: 'java/service/SystemUserService.java',
        code: 'public interface SystemUserService {\n\n    PageResult<SystemUserVO> page(SystemUserPageReqVO reqVO);\n\n    Long create(SystemUserCreateReqVO reqVO);\n\n    void update(SystemUserUpdateReqVO reqVO);\n\n    void delete(Long id);\n}',
      },
      {
        filePath: 'vue/system/user/index.vue',
        code: '<template>\n  <ContentWrap>\n    <el-table :data="list">\n      <el-table-column prop="username" label="用户账号" />\n      <el-table-column prop="nickname" label="用户昵称" />\n    </el-table>\n  </ContentWrap>\n</template>',
      },
    ]
    return HttpResponse.json(success(preview))
  }),

  // 下载
  http.get('*/infra/codegen/download', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),

  // 数据库表列表
  http.get('*/infra/codegen/db/table/list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const name = url.searchParams.get('name')
    const comment = url.searchParams.get('comment')

    let filtered = [...mockDbTables]
    if (name) filtered = filtered.filter((t) => t.name.includes(name))
    if (comment) filtered = filtered.filter((t) => t.comment.includes(comment))

    return HttpResponse.json(success(filtered))
  }),

  // 导入表
  http.post('*/infra/codegen/create-list', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),

  // 删除
  http.delete('*/infra/codegen/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // 批量删除
  http.delete('*/infra/codegen/delete-list', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // 数据源配置列表
  http.get('*/infra/data-source-config/list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockDataSourceConfigs))
  }),
]

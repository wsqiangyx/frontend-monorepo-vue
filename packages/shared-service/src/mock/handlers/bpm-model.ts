// ============================================================================
// 工作流模块 Mock Handlers（模型、定义、任务、表单、分类、实例、辅助）
// ============================================================================
import { http, HttpResponse, delay } from 'msw'
import { success, paginate } from '../helpers'

// --- 流程分类 ---
const mockCategories = [
  {
    id: 1,
    name: 'OA审批',
    code: 'oa',
    sort: 1,
    status: 0,
    remark: 'OA审批流程',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    name: '财务审批',
    code: 'finance',
    sort: 2,
    status: 0,
    remark: '财务审批流程',
    createTime: '2026-01-01',
  },
  {
    id: 3,
    name: '人事管理',
    code: 'hr',
    sort: 3,
    status: 0,
    remark: '人事管理流程',
    createTime: '2026-01-01',
  },
]

// --- 流程模型 ---
const mockModels = [
  {
    id: 1,
    formName: '请假申请表',
    key: 'leave',
    name: '请假流程',
    description: '员工请假审批流程',
    category: 'oa',
    categoryName: 'OA审批',
    formType: 1,
    formId: 1,
    formCustomCreatePath: '',
    formCustomViewPath: '',
    processDefinition: {
      id: 'def_1',
      version: 1,
      deploymentTime: '2026-03-01',
      suspensionState: 1,
    },
    status: 1,
    remark: '',
    createTime: '2026-02-15',
    bpmnXml: '',
  },
  {
    id: 2,
    formName: '报销申请表',
    key: 'expense',
    name: '报销流程',
    description: '费用报销审批流程',
    category: 'finance',
    categoryName: '财务审批',
    formType: 1,
    formId: 2,
    formCustomCreatePath: '',
    formCustomViewPath: '',
    processDefinition: {
      id: 'def_2',
      version: 2,
      deploymentTime: '2026-04-01',
      suspensionState: 1,
    },
    status: 1,
    remark: '',
    createTime: '2026-03-01',
    bpmnXml: '',
  },
  {
    id: 3,
    formName: '转正申请表',
    key: 'regularization',
    name: '转正流程',
    description: '员工转正审批流程',
    category: 'hr',
    categoryName: '人事管理',
    formType: 1,
    formId: 3,
    formCustomCreatePath: '',
    formCustomViewPath: '',
    processDefinition: {
      id: 'def_3',
      version: 1,
      deploymentTime: '2026-05-01',
      suspensionState: 1,
    },
    status: 1,
    remark: '',
    createTime: '2026-04-01',
    bpmnXml: '',
  },
  {
    id: 4,
    formName: '',
    key: 'purchase',
    name: '采购流程',
    description: '采购审批流程',
    category: 'finance',
    categoryName: '财务审批',
    formType: 0,
    formId: 0,
    formCustomCreatePath: '',
    formCustomViewPath: '',
    processDefinition: undefined,
    status: 0,
    remark: '未部署',
    createTime: '2026-05-01',
    bpmnXml: '',
  },
]

// --- 流程表单 ---
const mockForms = [
  {
    id: 1,
    name: '请假申请表',
    status: 0,
    conf: '{}',
    fields: ['leaveType', 'startTime', 'endTime', 'reason'],
    remark: '请假表单',
    createTime: '2026-01-15',
  },
  {
    id: 2,
    name: '报销申请表',
    status: 0,
    conf: '{}',
    fields: ['amount', 'type', 'invoice', 'reason'],
    remark: '报销表单',
    createTime: '2026-02-01',
  },
  {
    id: 3,
    name: '转正申请表',
    status: 0,
    conf: '{}',
    fields: ['entryDate', 'department', 'selfEvaluation'],
    remark: '转正表单',
    createTime: '2026-03-01',
  },
]

// --- 流程实例 ---
const mockProcessInstances = [
  {
    id: 'inst_1',
    name: '请假流程-张三',
    key: 'leave',
    category: 'oa',
    processDefinitionId: 'def_1',
    processDefinitionKey: 'leave',
    processDefinitionName: '请假流程',
    status: 1,
    startUserNickname: '张三',
    startUserId: 3,
    summary: [
      { key: '请假类型', value: '年假' },
      { key: '天数', value: '3天' },
    ],
    formVariables: {},
    tasks: [],
    createTime: '2026-05-20 09:00:00',
    endTime: '',
  },
  {
    id: 'inst_2',
    name: '报销流程-李四',
    key: 'expense',
    category: 'finance',
    processDefinitionId: 'def_2',
    processDefinitionKey: 'expense',
    processDefinitionName: '报销流程',
    status: 2,
    startUserNickname: '李四',
    startUserId: 4,
    summary: [
      { key: '金额', value: '5000元' },
      { key: '类型', value: '差旅' },
    ],
    formVariables: {},
    tasks: [],
    createTime: '2026-05-18 14:00:00',
    endTime: '2026-05-19 10:00:00',
  },
  {
    id: 'inst_3',
    name: '转正流程-王五',
    key: 'regularization',
    category: 'hr',
    processDefinitionId: 'def_3',
    processDefinitionKey: 'regularization',
    processDefinitionName: '转正流程',
    status: 1,
    startUserNickname: '王五',
    startUserId: 5,
    summary: [
      { key: '入职日期', value: '2026-02-01' },
      { key: '部门', value: '研发部' },
    ],
    formVariables: {},
    tasks: [],
    createTime: '2026-05-15 10:00:00',
    endTime: '',
  },
  {
    id: 'inst_4',
    name: '请假流程-赵六',
    key: 'leave',
    category: 'oa',
    processDefinitionId: 'def_1',
    processDefinitionKey: 'leave',
    processDefinitionName: '请假流程',
    status: 3,
    startUserNickname: '赵六',
    startUserId: 2,
    summary: [
      { key: '请假类型', value: '事假' },
      { key: '天数', value: '1天' },
    ],
    formVariables: {},
    tasks: [],
    createTime: '2026-05-10 08:00:00',
    endTime: '2026-05-10 16:00:00',
  },
]

// --- 任务 ---
const mockTodoTasks = [
  {
    id: 'task_1',
    name: '部门经理审批',
    processInstanceId: 'inst_1',
    status: 0,
    assigneeUserNickname: '管理员',
    assigneeUserId: 1,
    createTime: '2026-05-20 09:30:00',
    endTime: '',
    reason: '',
    processInstance: mockProcessInstances[0],
  },
  {
    id: 'task_2',
    name: '财务审批',
    processInstanceId: 'inst_2',
    status: 0,
    assigneeUserNickname: '管理员',
    assigneeUserId: 1,
    createTime: '2026-05-18 15:00:00',
    endTime: '',
    reason: '',
    processInstance: mockProcessInstances[1],
  },
]

const mockDoneTasks = [
  {
    id: 'task_3',
    name: '人事审批',
    processInstanceId: 'inst_3',
    status: 2,
    assigneeUserNickname: '管理员',
    assigneeUserId: 1,
    createTime: '2026-05-15 11:00:00',
    endTime: '2026-05-16 09:00:00',
    reason: '同意',
    processInstance: mockProcessInstances[2],
  },
  {
    id: 'task_4',
    name: '部门经理审批',
    processInstanceId: 'inst_4',
    status: 3,
    assigneeUserNickname: '管理员',
    assigneeUserId: 1,
    createTime: '2026-05-10 08:30:00',
    endTime: '2026-05-10 15:00:00',
    reason: '理由不充分',
    processInstance: mockProcessInstances[3],
  },
]

// --- 用户分组 ---
const mockUserGroups = [
  {
    id: 1,
    name: '部门负责人',
    description: '所有部门负责人',
    status: 0,
    memberUserIds: [1, 2],
    remark: '',
    createTime: '2026-01-01',
  },
  {
    id: 2,
    name: '财务人员',
    description: '财务部门人员',
    status: 0,
    memberUserIds: [3],
    remark: '',
    createTime: '2026-01-15',
  },
]

// --- 流程监听器 ---
const mockListeners = [
  {
    id: 1,
    name: '审批通过通知',
    type: 1,
    event: 1,
    valueType: 1,
    value: 'notifyService.send',
    status: 0,
    remark: '审批通过后发送通知',
    createTime: '2026-02-01',
  },
  {
    id: 2,
    name: '创建流程日志',
    type: 0,
    event: 0,
    valueType: 0,
    value: 'logListener.create',
    status: 0,
    remark: '创建流程时记录日志',
    createTime: '2026-02-01',
  },
]

// --- 流程表达式 ---
const mockExpressions = [
  {
    id: 1,
    name: '金额大于1万',
    expression: '${amount > 10000}',
    status: 0,
    remark: '金额大于1万需要总监审批',
    createTime: '2026-03-01',
  },
  {
    id: 2,
    name: '天数大于3天',
    expression: '${days > 3}',
    status: 0,
    remark: '请假天数大于3天需要总经理审批',
    createTime: '2026-03-01',
  },
]

export const bpmHandlers = [
  // ===== 流程分类 =====
  http.get('*/bpm/category/simple-list', async () => {
    await delay(100)
    return HttpResponse.json(success(mockCategories))
  }),
  http.get('*/bpm/category/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockCategories, mockCategories.length, pageNo, pageSize))
  }),
  http.post('*/bpm/category/create', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/category/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/category/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/category/update-sort-batch', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 流程模型 =====
  http.get('*/bpm/model/list', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const name = url.searchParams.get('name')
    let filtered = [...mockModels]
    if (name) filtered = filtered.filter((m) => m.name.includes(name))
    return HttpResponse.json(success(filtered))
  }),
  http.get('*/bpm/model/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const model = mockModels.find((m) => m.id === id)
    if (!model)
      return HttpResponse.json(
        { success: false, code: '404', message: '模型不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(model))
  }),
  http.post('*/bpm/model/create', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/model/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/model/update-bpmn', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/model/update-state', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/model/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.post('*/bpm/model/deploy', async () => {
    await delay(300)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/model/clean', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 流程定义 =====
  http.get('*/bpm/definition/simple-list', async () => {
    await delay(100)
    const list = mockModels
      .filter((m) => m.processDefinition)
      .map((m) => ({ key: m.key, name: m.name }))
    return HttpResponse.json(success(list))
  }),
  http.get('*/bpm/definition/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const defs = mockModels
      .filter((m) => m.processDefinition)
      .map((m) => ({
        id: m.processDefinition!.id,
        key: m.key,
        name: m.name,
        version: m.processDefinition!.version,
        category: m.category,
        deploymentTime: m.processDefinition!.deploymentTime,
        suspensionState: m.processDefinition!.suspensionState,
      }))
    return HttpResponse.json(paginate(defs, defs.length, pageNo, pageSize))
  }),
  http.put('*/bpm/definition/update-state', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/definition/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 流程表单 =====
  http.get('*/bpm/form/simple-list', async () => {
    await delay(100)
    const list = mockForms.map((f) => ({ id: f.id, name: f.name }))
    return HttpResponse.json(success(list))
  }),
  http.get('*/bpm/form/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockForms, mockForms.length, pageNo, pageSize))
  }),
  http.get('*/bpm/form/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const form = mockForms.find((f) => f.id === id)
    if (!form)
      return HttpResponse.json(
        { success: false, code: '404', message: '表单不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(form))
  }),
  http.post('*/bpm/form/create', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/form/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/form/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 流程实例 =====
  http.get('*/bpm/process-instance/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const name = url.searchParams.get('name')
    const status = url.searchParams.get('status')
    let filtered = [...mockProcessInstances]
    if (name) filtered = filtered.filter((p) => p.name.includes(name))
    if (status !== null && status !== undefined && status !== '')
      filtered = filtered.filter((p) => p.status === Number(status))
    return HttpResponse.json(paginate(filtered, filtered.length, pageNo, pageSize))
  }),
  http.get('*/bpm/process-instance/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const instance = mockProcessInstances.find((p) => p.id === id)
    if (!instance)
      return HttpResponse.json(
        { success: false, code: '404', message: '实例不存在' },
        { status: 404 },
      )
    return HttpResponse.json(success(instance))
  }),
  http.put('*/bpm/process-instance/cancel', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 任务 =====
  http.get('*/bpm/task/todo-page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockTodoTasks, mockTodoTasks.length, pageNo, pageSize))
  }),
  http.get('*/bpm/task/done-page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockDoneTasks, mockDoneTasks.length, pageNo, pageSize))
  }),
  http.get('*/bpm/task/manager-page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    const all = [...mockTodoTasks, ...mockDoneTasks]
    return HttpResponse.json(paginate(all, all.length, pageNo, pageSize))
  }),
  http.put('*/bpm/task/approve', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/task/reject', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.get('*/bpm/task/list-by-process-instance-id', async () => {
    await delay(100)
    return HttpResponse.json(success([...mockTodoTasks, ...mockDoneTasks]))
  }),
  http.put('*/bpm/task/delegate', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/task/transfer', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/task/withdraw', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 用户分组 =====
  http.get('*/bpm/user-group/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockUserGroups, mockUserGroups.length, pageNo, pageSize))
  }),
  http.get('*/bpm/user-group/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const group = mockUserGroups.find((g) => g.id === id)
    return HttpResponse.json(success(group))
  }),
  http.post('*/bpm/user-group/create', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/user-group/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/user-group/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 流程监听器 =====
  http.get('*/bpm/process-listener/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockListeners, mockListeners.length, pageNo, pageSize))
  }),
  http.get('*/bpm/process-listener/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const listener = mockListeners.find((l) => l.id === id)
    return HttpResponse.json(success(listener))
  }),
  http.post('*/bpm/process-listener/create', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/process-listener/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/process-listener/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),

  // ===== 流程表达式 =====
  http.get('*/bpm/process-expression/page', async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10)
    return HttpResponse.json(paginate(mockExpressions, mockExpressions.length, pageNo, pageSize))
  }),
  http.get('*/bpm/process-expression/get', async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const id = Number(url.searchParams.get('id'))
    const expr = mockExpressions.find((e) => e.id === id)
    return HttpResponse.json(success(expr))
  }),
  http.post('*/bpm/process-expression/create', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.put('*/bpm/process-expression/update', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
  http.delete('*/bpm/process-expression/delete', async () => {
    await delay(200)
    return HttpResponse.json(success(true))
  }),
]

// ============================================================================
// 工作流模块类型定义
// ============================================================================

// --- 流程模型 ---
export interface ProcessDefinitionVO {
  id: string
  version: number
  deploymentTime: string
  suspensionState: number
  formType?: number
  formCustomCreatePath?: string
}

export interface ModelVO {
  id: number
  formName: string
  key: string
  name: string
  description: string
  category: string
  categoryName?: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition?: ProcessDefinitionVO
  status: number
  remark: string
  createTime: string
  bpmnXml?: string
}

// --- 流程定义 ---
export interface DefinitionVO {
  id: string
  key: string
  name: string
  version: number
  category: string
  deploymentTime: string
  suspensionState: number
}

// --- 流程表单 ---
export interface FormVO {
  id: number
  name: string
  status: number
  conf: string
  fields: string[]
  remark: string
  createTime: string
}

// --- 流程实例 ---
export interface ProcessInstanceVO {
  id: string
  name: string
  key: string
  category: string
  processDefinitionId: string
  processDefinitionKey: string
  processDefinitionName: string
  status: number
  startUserNickname: string
  startUserId: number
  summary: Array<{ key: string; value: string }>
  formVariables: Record<string, unknown>
  tasks: TaskVO[]
  createTime: string
  endTime: string
}

// --- 任务 ---
export interface TaskVO {
  id: string
  name: string
  processInstanceId: string
  processInstance?: ProcessInstanceVO
  status: number
  assigneeUserNickname: string
  assigneeUserId: number
  createTime: string
  endTime: string
  reason: string
}

// --- 流程分类 ---
export interface CategoryVO {
  id: number
  name: string
  code: string
  sort: number
  status: number
  remark: string
  createTime: string
}

// --- 用户分组 ---
export interface UserGroupVO {
  id: number
  name: string
  description: string
  status: number
  memberUserIds: number[]
  remark: string
  createTime: string
}

// --- 流程监听器 ---
export interface ProcessListenerVO {
  id: number
  name: string
  type: number
  event: number
  valueType: number
  value: string
  status: number
  remark: string
  createTime: string
}

// --- 流程表达式 ---
export interface ProcessExpressionVO {
  id: number
  name: string
  expression: string
  status: number
  remark: string
  createTime: string
}

// @repo/shared-workflow — 工作流引擎入口
// 基于 bpmn-js 的 Vue3 工作流组件（experimental）

export type { WorkflowEngineStatus, BpmnModel } from './core/types'
export { WORKFLOW_STATUS } from './core/types'

export { BpmnProcessDesigner } from './components/BpmnProcessDesigner'
export { BpmnProcessViewer } from './components/BpmnProcessViewer'
export { SimpleFlowDesigner } from './components/SimpleFlowDesigner'
export type { FlowNode, FlowCondition, FlowData } from './components/SimpleFlowDesigner'

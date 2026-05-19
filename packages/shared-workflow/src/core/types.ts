// @repo/shared-workflow/core — 框架无关的工作流核心类型

export const WORKFLOW_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
} as const

export type WorkflowEngineStatus = (typeof WORKFLOW_STATUS)[keyof typeof WORKFLOW_STATUS]

export interface BpmnModel {
  xml: string
  name?: string
  version?: string
}

import { describe, it, expect } from 'vitest'
import { WORKFLOW_STATUS } from '../core/types'

describe('shared-workflow', () => {
  it('exports workflow status constants', () => {
    expect(WORKFLOW_STATUS.IDLE).toBe('idle')
    expect(WORKFLOW_STATUS.LOADING).toBe('loading')
    expect(WORKFLOW_STATUS.READY).toBe('ready')
    expect(WORKFLOW_STATUS.ERROR).toBe('error')
  })
})

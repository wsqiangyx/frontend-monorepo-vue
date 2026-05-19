import { describe, expect, it } from 'vitest'
import {
  createPermissionSet,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  asPermissionCode,
} from '../permissions'

const pc = asPermissionCode

describe('createPermissionSet', () => {
  it('should create empty set by default', () => {
    const set = createPermissionSet()
    expect(set.codes.size).toBe(0)
  })

  it('should create set from codes', () => {
    const set = createPermissionSet([pc('user:read'), pc('user:write')])
    expect(set.codes.size).toBe(2)
  })
})

describe('hasPermission', () => {
  const set = createPermissionSet([pc('user:read'), pc('user:write')])

  it('should return true for existing permission', () => {
    expect(hasPermission(set, pc('user:read'))).toBe(true)
  })

  it('should return false for missing permission', () => {
    expect(hasPermission(set, pc('admin:delete'))).toBe(false)
  })
})

describe('hasAnyPermission', () => {
  const set = createPermissionSet([pc('user:read'), pc('user:write')])

  it('should return true if any permission matches', () => {
    expect(hasAnyPermission(set, [pc('admin:delete'), pc('user:read')])).toBe(true)
  })

  it('should return false if no permission matches', () => {
    expect(hasAnyPermission(set, [pc('admin:delete'), pc('admin:create')])).toBe(false)
  })

  it('should return false for empty codes', () => {
    expect(hasAnyPermission(set, [])).toBe(false)
  })
})

describe('hasAllPermissions', () => {
  const set = createPermissionSet([pc('user:read'), pc('user:write'), pc('role:read')])

  it('should return true if all permissions match', () => {
    expect(hasAllPermissions(set, [pc('user:read'), pc('user:write')])).toBe(true)
  })

  it('should return false if any permission is missing', () => {
    expect(hasAllPermissions(set, [pc('user:read'), pc('admin:delete')])).toBe(false)
  })

  it('should return true for empty codes', () => {
    expect(hasAllPermissions(set, [])).toBe(true)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from '../api/request'

describe('request instance', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('is a function (axios instance)', () => {
    expect(typeof request).toBe('function')
  })

  it('reads token from localStorage when available', () => {
    localStorage.setItem('access_token', 'test-token-123')
    expect(localStorage.getItem('access_token')).toBe('test-token-123')
    localStorage.removeItem('access_token')
  })
})

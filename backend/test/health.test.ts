import { test, expect } from 'vitest'
import { isServiceHealthy } from '../src/utils/health'

test('isServiceHealthy returns true', () => {
  expect(isServiceHealthy()).toBe(true)
})

import { test, expect } from 'vitest';
import { isServiceHealthy } from '../src/core/utils/health/health.util';

test('isServiceHealthy returns true', () => {
  expect(isServiceHealthy()).toBe(true)
})

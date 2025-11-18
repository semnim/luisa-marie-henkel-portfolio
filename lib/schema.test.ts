import { describe, it, expect } from 'vitest';
import { contentItems } from './schema';

describe('contentItems schema', () => {
  it('should have required fields', () => {
    expect(contentItems).toBeDefined();
    const columns = Object.keys(contentItems);
    expect(columns).toContain('page');
    expect(columns).toContain('section');
    expect(columns).toContain('key');
    expect(columns).toContain('value');
    expect(columns).toContain('position');
  });
});

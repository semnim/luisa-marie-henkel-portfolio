import { describe, it, expect } from 'vitest';
import { getAboutContentQueryOptions } from './get-about-content';

describe('getAboutContentQueryOptions', () => {
  it('should return query options with correct queryKey', () => {
    const options = getAboutContentQueryOptions();
    expect(options.queryKey).toEqual(['content', 'about']);
  });

  it('should have queryFn defined', () => {
    const options = getAboutContentQueryOptions();
    expect(options.queryFn).toBeDefined();
  });
});

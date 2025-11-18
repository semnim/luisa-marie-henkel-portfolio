import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchAboutContent, updateAboutParagraphs } from './actions';

// Mock db module
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      contentItems: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(),
    })),
  },
}));

import { db } from '@/lib/db';

describe('fetchAboutContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch about page content and return paragraphs array', async () => {
    const mockData = [
      { id: 1, page: 'about', section: 'intro', key: 'paragraph', value: 'Para 1', position: 1 },
      { id: 2, page: 'about', section: 'intro', key: 'paragraph', value: 'Para 2', position: 2 },
    ];

    vi.mocked(db.query.contentItems.findMany).mockResolvedValue(mockData);

    const result = await fetchAboutContent();

    expect(result).toBeDefined();
    expect(result.paragraphs).toBeInstanceOf(Array);
    expect(result.paragraphs).toEqual(['Para 1', 'Para 2']);
    expect(db.query.contentItems.findMany).toHaveBeenCalledOnce();
  });

  it('should return empty array when no content found', async () => {
    vi.mocked(db.query.contentItems.findMany).mockResolvedValue([]);

    const result = await fetchAboutContent();

    expect(result.paragraphs).toEqual([]);
  });

  it('should handle database errors gracefully', async () => {
    vi.mocked(db.query.contentItems.findMany).mockRejectedValue(new Error('DB error'));

    const result = await fetchAboutContent();

    expect(result.paragraphs).toEqual([]);
  });
});

describe('updateAboutParagraphs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update paragraphs successfully', async () => {
    const deleteMock = vi.fn();
    const valuesMock = vi.fn();

    vi.mocked(db.delete).mockReturnValue({ where: deleteMock } as any);
    vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as any);

    const result = await updateAboutParagraphs(['Para 1', 'Para 2']);

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(db.delete).toHaveBeenCalledOnce();
    expect(db.insert).toHaveBeenCalledOnce();
  });

  it('should validate empty paragraphs array', async () => {
    const result = await updateAboutParagraphs([]);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].field).toBe('paragraphs');
    expect(result.errors?.[0].message).toContain('At least one paragraph required');
  });

  it('should validate paragraphs with empty strings', async () => {
    const result = await updateAboutParagraphs(['Valid', '  ', 'Also valid']);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].field).toBe('paragraphs');
    expect(result.errors?.[0].message).toContain('cannot be empty');
  });

  it('should trim whitespace from paragraphs', async () => {
    const deleteMock = vi.fn();
    const valuesMock = vi.fn();

    vi.mocked(db.delete).mockReturnValue({ where: deleteMock } as any);
    vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as any);

    await updateAboutParagraphs(['  Para 1  ', '  Para 2  ']);

    expect(valuesMock).toHaveBeenCalledWith([
      { page: 'about', section: 'intro', key: 'paragraph', value: 'Para 1', position: 1 },
      { page: 'about', section: 'intro', key: 'paragraph', value: 'Para 2', position: 2 },
    ]);
  });

  it('should handle database errors during update', async () => {
    vi.mocked(db.delete).mockImplementation(() => {
      throw new Error('DB error');
    });

    const result = await updateAboutParagraphs(['Para 1']);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0].field).toBe('_general');
  });
});

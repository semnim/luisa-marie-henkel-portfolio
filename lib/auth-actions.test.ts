import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginUser } from './auth-actions';

// Mock auth
vi.mock('./auth', () => ({
  auth: {
    api: {
      signInEmail: vi.fn(),
    },
  },
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

import { auth } from './auth';

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success when login succeeds', async () => {
    vi.mocked(auth.api.signInEmail).mockResolvedValue({
      user: { id: '1', email: 'test@example.com', name: 'Test User', image: null, emailVerified: true, createdAt: new Date(), updatedAt: new Date() },
      token: 'token',
      redirect: false,
      url: undefined
    });

    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns error when login fails', async () => {
    vi.mocked(auth.api.signInEmail).mockResolvedValue(null as unknown as Awaited<ReturnType<typeof auth.api.signInEmail>>);

    const result = await loginUser({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Login failed');
  });

  it('handles network errors gracefully', async () => {
    vi.mocked(auth.api.signInEmail).mockRejectedValue(
      new Error('Network error')
    );

    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });
});

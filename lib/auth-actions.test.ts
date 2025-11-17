import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginUser } from './auth-actions';

// Mock auth client
vi.mock('./auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
  },
}));

import { authClient } from './auth-client';

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success when login succeeds', async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null,
    });

    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns error when login fails', async () => {
    vi.mocked(authClient.signIn.email).mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    const result = await loginUser({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  it('handles network errors gracefully', async () => {
    vi.mocked(authClient.signIn.email).mockRejectedValue(
      new Error('Network error')
    );

    const result = await loginUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unable to connect. Please try again.');
  });
});

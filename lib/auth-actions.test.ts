import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser } from './auth-actions';

// Mock auth client
vi.mock('./auth-client', () => ({
  authClient: {
    signUp: {
      email: vi.fn(),
    },
    signIn: {
      email: vi.fn(),
    },
  },
}));

import { authClient } from './auth-client';

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success when registration succeeds', async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com', name: 'Test' } },
      error: null,
    });

    const result = await registerUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns error when registration fails', async () => {
    vi.mocked(authClient.signUp.email).mockResolvedValue({
      data: null,
      error: { message: 'Email already exists' },
    });

    const result = await registerUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Email already exists');
  });

  it('handles network errors gracefully', async () => {
    vi.mocked(authClient.signUp.email).mockRejectedValue(
      new Error('Network error')
    );

    const result = await registerUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Unable to connect. Please try again.');
  });
});

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

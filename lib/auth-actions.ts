'use server';

import { authClient } from './auth-client';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function registerUser(
  data: RegisterFormData
): Promise<AuthResult> {
  try {
    const result = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'Registration failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Unable to connect. Please try again.',
    };
  }
}

export async function loginUser(data: LoginFormData): Promise<AuthResult> {
  try {
    const result = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message || 'Login failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Unable to connect. Please try again.',
    };
  }
}

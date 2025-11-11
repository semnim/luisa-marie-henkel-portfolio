'use server';

import { auth } from './auth';
import { headers } from 'next/headers';

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
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: 'Registration failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to connect. Please try again.',
    };
  }
}

export async function loginUser(data: LoginFormData): Promise<AuthResult> {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        success: false,
        error: 'Login failed',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unable to connect. Please try again.',
    };
  }
}

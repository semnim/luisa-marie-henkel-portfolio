'use client';

import { registerUser, type RegisterFormData } from '@/lib/auth-actions';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { AnimatedBorderButton } from '@/components/auth/animated-border-button';
import { AnimatedInput } from '@/components/auth/animated-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name too long'),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password too long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function RegisterPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setFormState('loading');
    setErrorMessage('');

    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      setFormState('success');
      form.reset();
    } else {
      setFormState('error');
      setErrorMessage(result.error || 'An error occurred. Please try again.');
    }
  };

  const handleReset = () => {
    setFormState('idle');
    setErrorMessage('');
    form.reset();
  };

  return (
    <main className="snap-y snap-mandatory overflow-y-scroll h-dvh md:h-auto md:overflow-y-hidden">
      <section className="relative h-[calc(100dvh-60px)] mt-15 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          {formState !== 'error' && (
            <h2 className="text-xl md:text-3xl w-fit mx-auto text-center font-light tracking-hero-heading flex items-center mb-12">
              REGISTER
            </h2>
          )}

          {formState === 'success' ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-2xl font-light tracking-wide">
                  Registration successful!
                </p>
                <p className="text-muted-foreground font-light">
                  Please log in to continue.
                </p>
              </div>
              <Link href="/login">
                <AnimatedBorderButton className="uppercase tracking-item-subheading font-light">
                  Go to Login
                </AnimatedBorderButton>
              </Link>
            </div>
          ) : formState === 'error' ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-2xl font-light tracking-wide text-muted-foreground">
                  Registration failed.
                </p>
                <p className="text-muted-foreground font-light">
                  {errorMessage}
                </p>
              </div>
              <AnimatedBorderButton
                onClick={handleReset}
                className="uppercase tracking-item-subheading font-light"
              >
                Try Again
              </AnimatedBorderButton>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-xl mx-auto"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AnimatedInput
                          type="text"
                          placeholder="Name*"
                          hasValue={!!field.value}
                          disabled={formState === 'loading'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AnimatedInput
                          type="email"
                          placeholder="Email*"
                          hasValue={!!field.value}
                          disabled={formState === 'loading'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AnimatedInput
                          type="password"
                          placeholder="Password* (min 8 characters)"
                          hasValue={!!field.value}
                          disabled={formState === 'loading'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AnimatedInput
                          type="password"
                          placeholder="Confirm Password*"
                          hasValue={!!field.value}
                          disabled={formState === 'loading'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatedBorderButton
                  type="submit"
                  disabled={formState === 'loading'}
                >
                  {formState === 'loading' ? 'Registering...' : 'Register'}
                </AnimatedBorderButton>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="underline hover:text-foreground">
                    Login
                  </Link>
                </p>
              </form>
            </Form>
          )}
        </div>
      </section>
    </main>
  );
}

'use client';

import { AnimatedBorderButton } from '@/components/auth/animated-border-button';
import { AnimatedInput } from '@/components/auth/animated-input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { loginUser, type LoginFormData } from '@/lib/auth-actions';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
});

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function LoginPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setFormState('loading');
    setErrorMessage('');

    const result = await loginUser(data);

    if (result.success) {
      setFormState('success');
      router.push('/admin');
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
    <main className="snap-y snap-mandatory overflow-y-scroll h-dvh md:h-auto md:overflow-y-hidden overscroll-none">
      <section className="relative h-[calc(100dvh-60px)] mt-15 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          {formState !== 'error' && (
            <h2 className="text-xl md:text-3xl w-fit mx-auto text-center font-light tracking-hero-heading flex items-center mb-12">
              LOGIN
            </h2>
          )}

          {formState === 'error' ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-2xl font-light tracking-wide text-muted-foreground">
                  Login failed.
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
                          placeholder="Password*"
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
                  {formState === 'loading' ? 'Logging in...' : 'Login'}
                </AnimatedBorderButton>

                <p className="text-center text-sm text-muted-foreground">
                  Need an account?{' '}
                  <Link
                    href="/register"
                    className="underline hover:text-foreground"
                  >
                    Register
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

'use client';

import { submitContactForm, type ContactFormData } from '@/app/actions/contact';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { AnimatedBorderButton } from '@/components/auth/animated-border-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z.email({ message: 'Invalid email address' }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message too long'),
});

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormState('loading');
    setErrorMessage('');

    const result = await submitContactForm(data);

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
              GET IN TOUCH
            </h2>
          )}

          {formState === 'success' ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-2xl font-light tracking-wide">
                  Message sent successfully!
                </p>
                <p className="text-muted-foreground font-light">
                  Thanks for reaching out. I&apos;ll get back to you soon.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="uppercase tracking-item-subheading font-light"
              >
                Send Another Message
              </button>
            </div>
          ) : formState === 'error' ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-2xl font-light tracking-wide text-muted-foreground">
                  Failed to send message.
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
                        <div className="relative group">
                          <input
                            className="w-full border-0 outline-0 border-muted-foreground rounded-none bg-transparent border-t pt-2"
                            placeholder="Name*"
                            {...field}
                            disabled={formState === 'loading'}
                          />
                          <div
                            className={`absolute top-0 left-0 h-px bg-foreground transition-all duration-500 ease-out ${
                              field.value
                                ? 'w-full'
                                : 'w-0 group-focus-within:w-full group-hover:w-full'
                            }`}
                          />
                        </div>
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
                        <div className="relative group">
                          <input
                            type="email"
                            className="w-full border-0 outline-0 border-muted-foreground rounded-none bg-transparent border-t pt-2"
                            placeholder="Email*"
                            {...field}
                            disabled={formState === 'loading'}
                          />
                          <div
                            className={`absolute top-0 left-0 h-px bg-foreground transition-all duration-500 ease-out ${
                              field.value
                                ? 'w-full'
                                : 'w-0 group-focus-within:w-full group-hover:w-full'
                            }`}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative group">
                          <textarea
                            placeholder="Tell me about your project..."
                            className="w-full p-4 text-foreground outline-0 border-muted-foreground border resize-none min-h-[120px] h-full"
                            {...field}
                            disabled={formState === 'loading'}
                          />
                          {/* Animated borders */}
                          <span
                            tabIndex={-1}
                            className="absolute top-0 left-0 w-0 h-px bg-foreground group-focus-within:w-full group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out"
                          />
                          <span
                            tabIndex={-1}
                            className="absolute top-0 left-0 w-px h-0 bg-foreground group-focus-within:h-full group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out"
                          />
                          <span
                            tabIndex={-1}
                            className="absolute bottom-0 right-0 w-0 h-px bg-foreground group-focus-within:w-full group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out"
                          />
                          <span
                            tabIndex={-1}
                            className="absolute top-0 right-0 w-px h-0 bg-foreground group-focus-within:h-full group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AnimatedBorderButton
                  type="submit"
                  disabled={formState === 'loading'}
                >
                  <span className="relative z-10">
                    {formState === 'loading' ? 'Sending...' : 'Send'}
                  </span>
                </AnimatedBorderButton>
              </form>
            </Form>
          )}
        </div>
      </section>
    </main>
  );
}

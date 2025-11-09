'use client';

import { submitContactForm, type ContactFormData } from '@/app/actions/contact';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Invalid email address' }),
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
          <h2 className="text-xl md:text-3xl w-fit mx-auto text-center font-light tracking-hero-heading flex items-center mb-12">
            GET IN TOUCH
          </h2>

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
              <Button
                onClick={handleReset}
                variant="outline"
                className="uppercase tracking-item-subheading font-light"
              >
                Send Another Message
              </Button>
            </div>
          ) : formState === 'error' ? (
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-2xl font-light tracking-wide text-red-400">
                  Failed to send message
                </p>
                <p className="text-muted-foreground font-light">
                  {errorMessage}
                </p>
              </div>
              <Button
                onClick={handleReset}
                variant="outline"
                className="uppercase tracking-item-subheading font-light"
              >
                Try Again
              </Button>
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
                        <Input
                          className="border-0 rounded-none focus-visible:rounded-sm bg-transparent border-t"
                          placeholder="Name*"
                          {...field}
                          disabled={formState === 'loading'}
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
                        <Input
                          type="email"
                          className="border-0 rounded-none focus-visible:rounded-sm bg-transparent border-t"
                          placeholder="Email*"
                          {...field}
                          disabled={formState === 'loading'}
                        />
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
                        <Textarea
                          placeholder="Tell me about your project..."
                          className="bg-transparent border-0 border-t rounded-none focus-visible:rounded-sm"
                          {...field}
                          disabled={formState === 'loading'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant={'outline'}
                  disabled={formState === 'loading'}
                  className="w-full uppercase tracking-item-subheading"
                >
                  {formState === 'loading' ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </section>
    </main>
  );
}

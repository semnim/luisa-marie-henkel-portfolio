'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

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

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validatedData = contactFormSchema.parse(data);

    // Rate limiting
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return {
        success: false,
        error: 'Too many submissions. Please try again later.',
      };
    }

    // Check for required environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return {
        success: false,
        error: 'Server configuration error. Please try again later.',
      };
    }

    if (!process.env.CONTACT_EMAIL) {
      console.error('CONTACT_EMAIL not configured');
      return {
        success: false,
        error: 'Server configuration error. Please try again later.',
      };
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>
      `,
      text: `
New Contact Form Submission

Name: ${validatedData.name}
Email: ${validatedData.email}
Message:
${validatedData.message}

Submitted at: ${new Date().toISOString()}
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: 'Please try again.',
      };
    }

    return { success: true };
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as z.ZodError<ContactFormData>;
      const firstIssue = zodError.issues[0];
      return {
        success: false,
        error: firstIssue?.message || 'Validation error',
      };
    }

    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

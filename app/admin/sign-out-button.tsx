'use client';

import { AnimatedBorderButton } from '@/components/auth/animated-border-button';
import { authClient } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export const SignOutButton = () => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = authClient.useSession();
  if (error) return null;

  return (
    <AnimatedBorderButton
      className="max-w-md"
      onClick={() => authClient.signOut().then(() => redirect('/'))}
    >
      Sign {isPending ? '...' : session?.user.name} out
    </AnimatedBorderButton>
  );
};

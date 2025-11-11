import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignOutButton } from './sign-out-button';

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  if (session?.user === undefined) {
    redirect('/');
  }
  return (
    <main className="overscroll-none h-dvh max-h-dvh">
      <section className="snap-start flex flex-col flex-1 items-center justify-center  px-6 h-full">
        <span>Hello {session?.user.name}!</span>
        <div className="flex justify-center mt-4">
          <SignOutButton />
        </div>
      </section>
    </main>
  );
}

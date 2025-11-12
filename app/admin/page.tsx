import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user === undefined) {
    redirect('/');
  }

  // Redirect authenticated users to the home dashboard
  redirect('/admin/home');
}

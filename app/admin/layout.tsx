import { Sidebar } from '@/components/admin/sidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user === undefined) {
    redirect('/login');
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Sidebar />
      <main className="md:ml-75 min-h-dvh">{children}</main>
    </div>
  );
}

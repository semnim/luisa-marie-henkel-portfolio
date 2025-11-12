import { Sidebar } from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Sidebar />
      <main className="md:ml-60 min-h-dvh">{children}</main>
    </div>
  );
}

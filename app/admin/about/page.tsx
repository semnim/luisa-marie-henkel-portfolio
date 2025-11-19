import { AboutAdmin } from '@/features/admin/about/components/about-admin';
import { getAboutContentQueryOptions } from '@/features/about/api/get-about-content';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function AdminAboutPage() {
  const queryClient = new QueryClient();

  // Prefetch about content
  await queryClient.prefetchQuery(getAboutContentQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AboutAdmin />
    </HydrationBoundary>
  );
}

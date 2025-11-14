import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import {
  getHeroQueryOptions,
  getFeaturedProjectsQueryOptions,
} from '@/features/home/api';
import { getProjectsQueryOptions } from '@/features/projects/api';
import { HomeAdmin } from '@/features/home/components';

export default async function AdminHomePage() {
  const queryClient = new QueryClient();

  // Prefetch all 3 data sources in parallel
  await Promise.all([
    queryClient.prefetchQuery(getHeroQueryOptions()),
    queryClient.prefetchQuery(getFeaturedProjectsQueryOptions()),
    queryClient.prefetchQuery(getProjectsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeAdmin />
    </HydrationBoundary>
  );
}

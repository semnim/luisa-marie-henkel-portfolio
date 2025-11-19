import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getProjectsWithImagesQueryOptions } from '@/features/portfolio/api';
import { ProjectsList } from '@/features/portfolio/components';

export default async function AdminPortfolioPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getProjectsWithImagesQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsList />
    </HydrationBoundary>
  );
}

import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchFeaturedProjects } from '../actions';
import { QueryConfig } from '@/lib/react-query';

export const getFeaturedProjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ['home', 'featured'],
    queryFn: () => fetchFeaturedProjects(),
  });
};

type UseFeaturedProjectsOptions = {
  queryConfig?: QueryConfig<typeof getFeaturedProjectsQueryOptions>;
};

export const useFeaturedProjects = ({
  queryConfig = {},
}: UseFeaturedProjectsOptions = {}) => {
  return useQuery({
    ...getFeaturedProjectsQueryOptions(),
    ...queryConfig,
  });
};

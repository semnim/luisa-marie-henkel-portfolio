import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchAllProjects } from '../actions';
import { QueryConfig } from '@/lib/react-query';

export const getProjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ['projects'],
    queryFn: () => fetchAllProjects(),
  });
};

type UseProjectsOptions = {
  queryConfig?: QueryConfig<typeof getProjectsQueryOptions>;
};

export const useProjects = ({ queryConfig = {} }: UseProjectsOptions = {}) => {
  return useQuery({
    ...getProjectsQueryOptions(),
    ...queryConfig,
  });
};

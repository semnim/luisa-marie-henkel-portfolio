import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchAboutContent } from '../actions';
import { QueryConfig } from '@/lib/react-query';

export const getAboutContentQueryOptions = () => {
  return queryOptions({
    queryKey: ['content', 'about'],
    queryFn: () => fetchAboutContent(),
  });
};

type UseAboutContentOptions = {
  queryConfig?: QueryConfig<typeof getAboutContentQueryOptions>;
};

export const useAboutContent = ({
  queryConfig = {},
}: UseAboutContentOptions = {}) => {
  return useQuery({
    ...getAboutContentQueryOptions(),
    ...queryConfig,
  });
};

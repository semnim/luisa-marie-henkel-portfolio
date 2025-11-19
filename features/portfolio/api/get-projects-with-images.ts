import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchAllProjectsWithImages } from '../actions';
import { QueryConfig } from '@/lib/react-query';

export const getProjectsWithImagesQueryOptions = () => {
  return queryOptions({
    queryKey: ['projects', 'with-images'],
    queryFn: () => fetchAllProjectsWithImages(),
  });
};

type UseProjectsWithImagesOptions = {
  queryConfig?: QueryConfig<typeof getProjectsWithImagesQueryOptions>;
};

export const useProjectsWithImages = ({
  queryConfig = {},
}: UseProjectsWithImagesOptions = {}) => {
  return useQuery({
    ...getProjectsWithImagesQueryOptions(),
    ...queryConfig,
  });
};

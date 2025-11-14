import { queryOptions, useQuery } from '@tanstack/react-query';
import { fetchCurrentHero } from '../actions';
import { QueryConfig } from '@/lib/react-query';

export const getHeroQueryOptions = () => {
  return queryOptions({
    queryKey: ['home', 'hero'],
    queryFn: () => fetchCurrentHero(),
  });
};

type UseHeroOptions = {
  queryConfig?: QueryConfig<typeof getHeroQueryOptions>;
};

export const useHero = ({ queryConfig = {} }: UseHeroOptions = {}) => {
  return useQuery({
    ...getHeroQueryOptions(),
    ...queryConfig,
  });
};

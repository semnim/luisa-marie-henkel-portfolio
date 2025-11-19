import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { updateAboutParagraphs } from '../actions/about-content';

type UseUpdateAboutParagraphsOptions = {
  mutationConfig?: UseMutationOptions<
    Awaited<ReturnType<typeof updateAboutParagraphs>>,
    Error,
    string[]
  >;
};

export const useUpdateAboutParagraphs = ({
  mutationConfig,
}: UseUpdateAboutParagraphsOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: updateAboutParagraphs,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['content', 'about'] });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};

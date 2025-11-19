import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { deleteProject } from '../actions';

type UseDeleteProjectOptions = {
  mutationConfig?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteProject>>,
    Error,
    number
  >;
};

export const useDeleteProject = ({
  mutationConfig,
}: UseDeleteProjectOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...mutationConfig,
    mutationFn: deleteProject,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      mutationConfig?.onSuccess?.(...args);
    },
  });
};

import {
  InvalidateQueryFilters,
  QueryKey,
  useQueryClient,
} from '@tanstack/react-query';

export const useOnSettledHandler = (
  queryKeys: QueryKey[],
  filters?: Omit<InvalidateQueryFilters, 'queryKey'>
): (() => Promise<void>) => {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all(
      queryKeys.map((key) =>
        queryClient.invalidateQueries({ queryKey: key, ...filters })
      )
    );
  };
};

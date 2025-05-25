import { arrayShallowEqual, arrayStartsWith } from '@/lib/objectUtils';
import { useQueryClient } from '@tanstack/react-query';

type UseOnSettledHandlerOptions = {
  exact?: boolean;
  forceExactKeys?: (readonly unknown[])[];
};

export const useOnSettledHandler = (
  keys: (readonly unknown[])[],
  options: UseOnSettledHandlerOptions = {}
) => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        return keys.some((targetKey) => {
          const keyToMatch = query.queryKey;
          const isForceExact = options.forceExactKeys?.some((forceKey) =>
            arrayShallowEqual(forceKey, targetKey)
          );

          if (isForceExact || options.exact) {
            return arrayShallowEqual(keyToMatch, targetKey);
          }

          return arrayStartsWith(keyToMatch, targetKey);
        });
      },
    });
  };
};

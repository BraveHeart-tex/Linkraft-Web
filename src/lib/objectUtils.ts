export const excludeKey = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...rest } = obj;
  return rest;
};

export const arrayShallowEqual = (
  a: readonly unknown[],
  b: readonly unknown[]
): boolean => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

export const arrayStartsWith = (
  longer: readonly unknown[],
  prefix: readonly unknown[]
): boolean => {
  return prefix.every((val, i) => longer[i] === val);
};

type AnyRef = React.RefObject<unknown> | React.RefCallback<unknown> | null;

export const mergeRefs = (...refs: AnyRef[]) => {
  return (instance: unknown) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref != null) {
        ref.current = instance;
      }
    });
  };
};

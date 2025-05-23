export const excludeKey = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): Omit<T, K> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...rest } = obj;
  return rest;
};

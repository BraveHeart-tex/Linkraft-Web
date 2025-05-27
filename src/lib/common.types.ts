export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;
export type ValueOf<T> = T[keyof T];

// DeepPartial<T>: recursively make all fields optional
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// RequireOnly<T, K>: require only keys K, others optional
export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// AtLeastOne<T>: require at least one key to be present
export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>;
}[keyof T];

// NonEmptyArray<T>: enforce array must have at least 1 item
export type NonEmptyArray<T> = [T, ...T[]];

// WithId<T>: add a generic id to any model
export type WithId<T, ID = number> = T & { id: ID };

// Timestamped<T>: add createdAt/updatedAt timestamps
export type Timestamped<T> = T & {
  createdAt: string;
  updatedAt: string;
};

export type NestedValueOf<T> = T extends object
  ? ValueOf<{ [K in keyof T]: NestedValueOf<T[K]> }>
  : T;

// Without<T, K>: remove keys from a type
export type Without<T, K extends keyof T> = Omit<T, K>;

// Merge<T, U>: merge two types, U overrides T
export type Merge<T, U> = Omit<T, keyof U> & U;

// PickDeep<T, K>: deeply pick keys (simple version)
export type PickDeep<T, K extends keyof T> = T[K] extends object ? T[K] : never;

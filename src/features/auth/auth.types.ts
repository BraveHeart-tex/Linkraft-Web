export interface UserWithoutPasswordHash {
  email: string;
  id: number;
  createdAt: Date;
  isActive: boolean;
  profilePicture: string;
  visibleName: string;
}

export type SessionValidationResult =
  | {
      user: UserWithoutPasswordHash;
    }
  | {
      user: null;
    };

export interface SignInResponse {
  user: UserWithoutPasswordHash;
}

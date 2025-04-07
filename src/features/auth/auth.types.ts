export interface UserWithoutPasswordHash {
  email: string;
  id: number;
  createdAt: Date;
  isActive: boolean;
  profilePicture: string;
}

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

export type SessionValidationResult =
  | {
      user: UserWithoutPasswordHash;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };

export interface SignInResponse {
  user: UserWithoutPasswordHash;
  session: Session;
}

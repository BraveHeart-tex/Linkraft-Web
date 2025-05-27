export interface User {
  email: string;
  id: string;
  createdAt: string;
  profilePicture: string;
  visibleName: string;
}

export type SessionValidationResult =
  | {
      user: User;
    }
  | {
      user: null;
    };

export interface SignInResponse {
  user: User;
}

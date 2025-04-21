import { UserWithoutPasswordHash } from '../auth/auth.types';

export interface Tag {
  id: number;
  name: string;
  userId: UserWithoutPasswordHash['id'];
}

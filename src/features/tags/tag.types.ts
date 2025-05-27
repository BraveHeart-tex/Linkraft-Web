import { User } from '../auth/auth.types';

export interface Tag {
  id: string;
  name: string;
  userId: User['id'];
}

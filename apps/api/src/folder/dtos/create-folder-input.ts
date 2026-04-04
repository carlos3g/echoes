import type { User } from '@app/user/entities/user.entity';

export interface CreateFolderInput {
  user: User;
  name: string;
  description?: string;
  color?: string;
  visibility?: 'PUBLIC' | 'PRIVATE';
}

import type { User } from '@app/user/entities/user.entity';

export interface ToggleFolderVisibilityInput {
  uuid: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  user: User;
}

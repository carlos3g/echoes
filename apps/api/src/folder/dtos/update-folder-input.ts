import type { User } from '@app/user/entities/user.entity';

export interface UpdateFolderInput {
  uuid: string;
  user: User;
  name?: string;
  description?: string | null;
  color?: string | null;
}

import type { User } from '@app/user/entities/user.entity';

export interface DeleteFolderInput {
  uuid: string;
  user: User;
}

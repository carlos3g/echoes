import type { User } from '@app/user/entities/user.entity';

export interface LeaveFolderInput {
  folderUuid: string;
  user: User;
}

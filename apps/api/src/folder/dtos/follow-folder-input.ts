import type { User } from '@app/user/entities/user.entity';

export interface FollowFolderInput {
  folderUuid: string;
  user: User;
}

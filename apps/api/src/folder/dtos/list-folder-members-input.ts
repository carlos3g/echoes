import type { User } from '@app/user/entities/user.entity';

export interface ListFolderMembersInput {
  folderUuid: string;
  user: User;
}

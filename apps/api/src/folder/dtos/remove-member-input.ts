import type { User } from '@app/user/entities/user.entity';

export interface RemoveMemberInput {
  folderUuid: string;
  memberUserUuid: string;
  user: User;
}

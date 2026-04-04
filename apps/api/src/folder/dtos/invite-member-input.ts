import type { User } from '@app/user/entities/user.entity';

export interface InviteByUsernameInput {
  folderUuid: string;
  username: string;
  role: 'EDITOR' | 'VIEWER';
  user: User;
}

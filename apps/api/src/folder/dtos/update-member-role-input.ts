import type { User } from '@app/user/entities/user.entity';

export interface UpdateMemberRoleInput {
  folderUuid: string;
  memberUserUuid: string;
  role: 'EDITOR' | 'VIEWER';
  user: User;
}

import type { User } from '@app/user/entities/user.entity';

export interface CreateInviteLinkInput {
  folderUuid: string;
  role: 'EDITOR' | 'VIEWER';
  maxUses?: number;
  user: User;
}

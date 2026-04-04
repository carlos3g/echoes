import type { User } from '@app/user/entities/user.entity';

export interface AcceptInviteInput {
  linkUuid: string;
  user: User;
}

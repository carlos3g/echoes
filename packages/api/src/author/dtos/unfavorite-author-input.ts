import type { User } from '@app/user/entities/user.entity';

export interface UnfavoriteAuthorInput {
  authorUuid: string;
  user: User;
}

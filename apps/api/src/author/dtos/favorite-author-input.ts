import type { User } from '@app/user/entities/user.entity';

export interface FavoriteAuthorInput {
  authorUuid: string;
  user: User;
}

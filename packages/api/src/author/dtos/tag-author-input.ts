import type { User } from '@app/user/entities/user.entity';

export interface TagAuthorInput {
  tagUuid: string;
  authorUuid: string;
  user: User;
}

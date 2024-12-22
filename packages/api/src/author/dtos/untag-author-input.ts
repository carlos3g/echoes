import type { User } from '@app/user/entities/user.entity';

export interface UntagAuthorInput {
  tagUuid: string;
  authorUuid: string;
  user: User;
}

import type { User } from '@app/user/entities/user.entity';

export interface CreateTagInput {
  user: User;

  title: string;
}

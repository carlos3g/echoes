import type { User } from '@app/user/entities/user.entity';

export interface UpdateTagInput {
  uuid: string;
  title: string;
  user: User;
}

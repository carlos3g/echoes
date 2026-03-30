import type { User } from '@app/user/entities/user.entity';

export interface DeleteTagInput {
  uuid: string;
  user: User;
}

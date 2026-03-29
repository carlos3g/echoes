import type { User } from '@app/user/entities/user.entity';

export interface GetOneAuthorInput {
  uuid: string;
  user?: User;
}

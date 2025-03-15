import type { User } from '@app/user/entities/user.entity';

export interface GetOneQuoteInput {
  uuid: string;
  user?: User;
}

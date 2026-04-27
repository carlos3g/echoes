import type { User } from '@app/user/entities/user.entity';

export interface TagQuoteInput {
  tagUuid: string;
  quoteUuid: string;
  user: User;
}

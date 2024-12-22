import type { User } from '@app/user/entities/user.entity';

export interface UnfavoriteQuoteInput {
  quoteUuid: string;
  user: User;
}

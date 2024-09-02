import type { User } from '@app/user/entities/user.entity';

export interface FavoriteQuoteInput {
  quoteUuid: string;
  user: User;
}

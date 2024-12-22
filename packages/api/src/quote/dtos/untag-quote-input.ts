import type { User } from '@app/user/entities/user.entity';

export interface UntagQuoteInput {
  tagUuid: string;
  quoteUuid: string;
  user: User;
}

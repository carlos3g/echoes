import type { User } from '@app/user/entities/user.entity';

export interface IsQuoteTaggedInput {
  quoteUuid: string;
  tagUuid: string;
  user: User;
}

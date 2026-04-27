import type { User } from '@app/user/entities/user.entity';

export interface ListQuoteTagsInput {
  quoteUuid: string;
  user: User;
}

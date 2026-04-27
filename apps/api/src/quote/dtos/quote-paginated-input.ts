import type { QuotePaginatedQuery } from '@app/quote/dtos/quote-paginated-query';
import type { User } from '@app/user/entities/user.entity';

export type QuotePaginatedInput = QuotePaginatedQuery & {
  user?: User;
};

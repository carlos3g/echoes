import type { TagPaginatedQuery } from '@app/tag/dtos/tag-paginated-query';
import type { User } from '@app/user/entities/user.entity';

export type TagPaginatedInput = TagPaginatedQuery & {
  user: User;
};

import type { AuthorPaginatedQuery } from '@app/author/dtos/author-paginated-query';
import type { User } from '@app/user/entities/user.entity';

export type AuthorPaginatedInput = AuthorPaginatedQuery & { user?: User };

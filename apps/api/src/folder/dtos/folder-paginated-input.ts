import type { FolderPaginatedQuery } from '@app/folder/dtos/folder-paginated-query';
import type { User } from '@app/user/entities/user.entity';

export type FolderPaginatedInput = FolderPaginatedQuery & {
  user: User;
};

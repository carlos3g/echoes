import type { Paginate } from '@app/shared/dtos/paginate';
import type { User } from '@app/user/entities/user.entity';

export interface SearchFoldersInput {
  query: string;
  paginate?: Paginate;
  user?: User;
}

import type { User } from '@app/user/entities/user.entity';
import type { Paginate } from '@app/shared/dtos/paginate';

export interface ListFolderQuotesInput {
  folderUuid: string;
  user?: User;
  paginate?: Paginate;
}

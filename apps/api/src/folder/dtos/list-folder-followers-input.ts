import type { Paginate } from '@app/shared/dtos/paginate';

export interface ListFolderFollowersInput {
  folderUuid: string;
  paginate?: Paginate;
}

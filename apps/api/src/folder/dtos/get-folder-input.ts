import type { User } from '@app/user/entities/user.entity';

export interface GetFolderInput {
  uuid: string;
  user?: User;
}

import type { User } from '@app/user/entities/user.entity';

export interface RemoveQuoteFromFolderInput {
  folderUuid: string;
  quoteUuid: string;
  user: User;
}

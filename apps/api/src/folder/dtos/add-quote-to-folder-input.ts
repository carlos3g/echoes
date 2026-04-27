import type { User } from '@app/user/entities/user.entity';

export interface AddQuoteToFolderInput {
  folderUuid: string;
  quoteUuid: string;
  user: User;
}

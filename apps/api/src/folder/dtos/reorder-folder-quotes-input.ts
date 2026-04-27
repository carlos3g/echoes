import type { User } from '@app/user/entities/user.entity';

export interface ReorderFolderQuotesInput {
  folderUuid: string;
  orderedQuoteUuids: string[];
  user: User;
}

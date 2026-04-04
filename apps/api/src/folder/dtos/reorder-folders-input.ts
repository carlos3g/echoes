import type { User } from '@app/user/entities/user.entity';

export interface ReorderFoldersInput {
  orderedUuids: string[];
  user: User;
}

import type { AtLeastOne } from '@app/shared/types';

export interface FolderInviteLinkRepositoryCreateInput {
  uuid: string;
  folderId: number;
  role: 'EDITOR' | 'VIEWER';
  createdById: number;
  maxUses?: number | null;
}

export interface FolderInviteLinkRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface FolderInviteLinkRepositoryIncrementUsedCountInput {
  id: number;
}

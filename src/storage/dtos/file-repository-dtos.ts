import type { AtLeastOne } from '@app/shared/types';

export interface FileRepositoryCreateInput {
  bucket: string;
  key: string;
}

export interface FileRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
  }>;
}

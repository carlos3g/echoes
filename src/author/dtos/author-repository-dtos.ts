import type { Paginate } from '@app/shared/dtos/paginate';
import type { AtLeastOne } from '@app/shared/types';

export interface AuthorRepositoryCreateInput {
  uuid: string;
  name: string;
  birthDate: Date;
  deathDate?: Date | null;
  bio: string;
}

export interface AuthorRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
  data: Partial<{ name: string; birthDate: Date; deathDate: Date; bio: string }>;
}

export interface AuthorRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
  }>;
}

export interface AuthorRepositoryFindManyInput {
  where?: {
    birthDate?: Date;
    deathDate?: Date;
  };
}

export interface AuthorRepositoryFindManyPaginatedInput {
  where?: {
    birthDate?: Date;
    deathDate?: Date;
  };
  options?: Paginate;
}

export interface AuthorRepositoryDeleteInput {
  where: AtLeastOne<{
    id?: number;
    uuid?: string;
  }>;
}

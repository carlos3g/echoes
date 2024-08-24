import type { AtLeastOne } from '@app/shared/types';

export interface UserRepositoryCreateInput {
  uuid: string;
  name: string;
  email: string;
  password: string;
}

export interface UserRepositoryUpdateInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
    email: string;
  }>;
  data: Partial<{ name: string; email: string; password: string }>;
}

export interface UserRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
    email: string;
  }>;
}

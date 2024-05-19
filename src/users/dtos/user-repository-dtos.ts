import type { AtLeastOne } from '@app/shared/types';

interface UserRepositoryCreateInput {
  name: string;
  email: string;
  password: string;
}

interface UserRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    id: number;
    uuid: string;
    email: string;
  }>;
}

export type { UserRepositoryCreateInput, UserRepositoryFindUniqueOrThrowInput };

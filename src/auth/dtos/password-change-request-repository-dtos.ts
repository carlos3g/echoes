import type { AtLeastOne } from '@app/shared/types';

export interface BatchOutput {
  count: number;
}

export interface PasswordChangeRequestRepositoryCreateInput {
  token: string;
  userId: number;
}

export interface PasswordChangeRequestRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    token: string;
  }>;
}

export interface PasswordChangeRequestRepositoryFindFirstOrThrowInput {
  where: Partial<{
    token: string;
    userId: number;
  }>;
}

export interface PasswordChangeRequestRepositoryDeleteManyInput {
  where: AtLeastOne<{
    token: string;
    userId: number;
  }>;
}

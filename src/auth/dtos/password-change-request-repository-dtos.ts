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

export interface PasswordChangeRequestRepositoryFindFirstValidOrThrowInput {
  where: Partial<{
    token: string;
    userId: number;
  }>;
}

export interface PasswordChangeRequestRepositoryUpdateInput {
  where: AtLeastOne<{
    token: string;
  }>;
  data: Partial<{ usedAt: Date }>;
}

export interface PasswordChangeRequestRepositoryDeleteManyInput {
  where: AtLeastOne<{
    token: string;
    userId: number;
  }>;
}

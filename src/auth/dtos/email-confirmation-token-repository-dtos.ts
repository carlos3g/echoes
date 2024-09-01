import type { AtLeastOne } from '@app/shared/types';

export interface EmailConfirmationTokenRepositoryCreateInput {
  token: string;
  userId: number;
  expiresAt: Date;
}

export interface EmailConfirmationTokenRepositoryFindUniqueOrThrowInput {
  where: AtLeastOne<{
    token: string;
  }>;
}

export interface EmailConfirmationTokenRepositoryFindFirstValidOrThrowInput {
  where: Partial<{
    token: string;
    userId: number;
  }>;
}

export interface EmailConfirmationTokenRepositoryUpdateInput {
  where: AtLeastOne<{
    token: string;
  }>;
  data: Partial<{ usedAt: Date }>;
}

export interface EmailConfirmationTokenRepositoryDeleteManyInput {
  where: AtLeastOne<{
    token: string;
    userId: number;
  }>;
}

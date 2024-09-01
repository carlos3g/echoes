import type {
  EmailConfirmationTokenRepositoryCreateInput,
  EmailConfirmationTokenRepositoryDeleteManyInput,
  EmailConfirmationTokenRepositoryFindFirstValidOrThrowInput,
  EmailConfirmationTokenRepositoryFindUniqueOrThrowInput,
  EmailConfirmationTokenRepositoryUpdateInput,
} from '@app/auth/dtos/email-confirmation-token-repository-dtos';
import type { EmailConfirmationToken } from '@app/auth/entities/email-confirmation-token.entity';
import type { BatchOutput } from '@app/lib/prisma/types';

abstract class EmailConfirmationTokenRepositoryContract {
  public abstract create(input: EmailConfirmationTokenRepositoryCreateInput): Promise<EmailConfirmationToken>;

  public abstract findUniqueOrThrow(
    input: EmailConfirmationTokenRepositoryFindUniqueOrThrowInput
  ): Promise<EmailConfirmationToken>;

  public abstract findFirstValidOrThrow(
    input: EmailConfirmationTokenRepositoryFindFirstValidOrThrowInput
  ): Promise<EmailConfirmationToken>;

  public abstract update(input: EmailConfirmationTokenRepositoryUpdateInput): Promise<EmailConfirmationToken>;

  public abstract deleteMany(input: EmailConfirmationTokenRepositoryDeleteManyInput): Promise<BatchOutput>;

  public abstract deleteUsed(): Promise<BatchOutput>;
}

export { EmailConfirmationTokenRepositoryContract };

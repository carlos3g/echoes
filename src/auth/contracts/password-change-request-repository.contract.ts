import type {
  BatchOutput,
  PasswordChangeRequestRepositoryCreateInput,
  PasswordChangeRequestRepositoryDeleteManyInput,
  PasswordChangeRequestRepositoryFindFirstOrThrowInput,
  PasswordChangeRequestRepositoryFindUniqueOrThrowInput,
} from '@app/auth/dtos/password-change-request-repository-dtos';
import type { PasswordChangeRequest } from '@app/auth/entities/password-change-request.entity';

abstract class PasswordChangeRequestRepositoryContract {
  public abstract create(input: PasswordChangeRequestRepositoryCreateInput): Promise<PasswordChangeRequest>;

  public abstract findUniqueOrThrow(
    input: PasswordChangeRequestRepositoryFindUniqueOrThrowInput
  ): Promise<PasswordChangeRequest>;

  public abstract findFirstOrThrow(
    input: PasswordChangeRequestRepositoryFindFirstOrThrowInput
  ): Promise<PasswordChangeRequest>;

  public abstract deleteMany(input: PasswordChangeRequestRepositoryDeleteManyInput): Promise<BatchOutput>;
}

export { PasswordChangeRequestRepositoryContract };

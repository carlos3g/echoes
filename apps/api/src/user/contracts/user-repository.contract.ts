import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  UserRepositoryCreateInput,
  UserRepositoryFindUniqueOrThrowInput,
  UserRepositorySearchPaginatedInput,
  UserRepositorySuggestedUsersInput,
  UserRepositoryUpdateInput,
} from '@app/user/dtos/user-repository-dtos';
import type { User } from '@app/user/entities/user.entity';

abstract class UserRepositoryContract {
  public abstract create(input: UserRepositoryCreateInput): Promise<User>;

  public abstract update(input: UserRepositoryUpdateInput): Promise<User>;

  public abstract findUniqueOrThrow(input: UserRepositoryFindUniqueOrThrowInput): Promise<User>;

  public abstract findUniqueByEmail(email: string): Promise<User | null>;

  public abstract searchPaginated(input: UserRepositorySearchPaginatedInput): Promise<PaginatedResult<User>>;

  public abstract suggestedUsers(input: UserRepositorySuggestedUsersInput): Promise<PaginatedResult<User>>;
}

export { UserRepositoryContract };

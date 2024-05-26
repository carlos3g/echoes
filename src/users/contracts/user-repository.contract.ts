import type {
  UserRepositoryCreateInput,
  UserRepositoryFindUniqueOrThrowInput,
  UserRepositoryUpdateInput,
} from '@app/users/dtos';
import type { User } from '@app/users/entities/user.entity';

abstract class UserRepositoryContract {
  public abstract create(input: UserRepositoryCreateInput): Promise<User>;

  public abstract update(input: UserRepositoryUpdateInput): Promise<User>;

  public abstract findUniqueOrThrow(input: UserRepositoryFindUniqueOrThrowInput): Promise<User>;
}

export { UserRepositoryContract };

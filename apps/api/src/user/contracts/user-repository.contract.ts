import type {
  UserRepositoryCreateInput,
  UserRepositoryFindUniqueOrThrowInput,
  UserRepositoryUpdateInput,
} from '@app/user/dtos/user-repository-dtos';
import type { User } from '@app/user/entities/user.entity';

abstract class UserRepositoryContract {
  public abstract create(input: UserRepositoryCreateInput): Promise<User>;

  public abstract update(input: UserRepositoryUpdateInput): Promise<User>;

  public abstract findUniqueOrThrow(input: UserRepositoryFindUniqueOrThrowInput): Promise<User>;

  public abstract findUniqueByEmail(email: string): Promise<User | null>;
}

export { UserRepositoryContract };

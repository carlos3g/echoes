import type {
  AuthorRepositoryCreateInput,
  AuthorRepositoryDeleteInput,
  AuthorRepositoryFindManyInput,
  AuthorRepositoryFindManyPaginatedInput,
  AuthorRepositoryFindUniqueOrThrowInput,
  AuthorRepositoryUpdateInput,
} from '@app/author/dtos/author-repository-dtos';
import type { Author } from '@app/author/entities/author.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';

abstract class AuthorRepositoryContract {
  public abstract create(input: AuthorRepositoryCreateInput): Promise<Author>;

  public abstract update(input: AuthorRepositoryUpdateInput): Promise<Author>;

  public abstract findUniqueOrThrow(input: AuthorRepositoryFindUniqueOrThrowInput): Promise<Author>;

  public abstract findManyPaginated(input: AuthorRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Author>>;

  public abstract findMany(input?: AuthorRepositoryFindManyInput): Promise<Author[]>;

  public abstract delete(input: AuthorRepositoryDeleteInput): Promise<void>;
}

export { AuthorRepositoryContract };

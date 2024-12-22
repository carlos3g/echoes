import type {
  AuthorRepositoryCreateInput,
  AuthorRepositoryDeleteInput,
  AuthorRepositoryFavoriteInput,
  AuthorRepositoryFindManyByTagInput,
  AuthorRepositoryFindManyFavoritedByUserInput,
  AuthorRepositoryFindManyInput,
  AuthorRepositoryFindManyPaginatedInput,
  AuthorRepositoryFindUniqueOrThrowInput,
  AuthorRepositoryIsFavoritedInput,
  AuthorRepositoryIsTaggedInput,
  AuthorRepositoryTagInput,
  AuthorRepositoryUnfavoriteInput,
  AuthorRepositoryUntagInput,
  AuthorRepositoryUpdateInput,
} from '@app/author/dtos/author-repository-dtos';
import type { Author } from '@app/author/entities/author.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';

abstract class AuthorRepositoryContract {
  public abstract create(input: AuthorRepositoryCreateInput): Promise<Author>;

  public abstract update(input: AuthorRepositoryUpdateInput): Promise<Author>;

  public abstract favorite(input: AuthorRepositoryFavoriteInput): Promise<void>;

  public abstract unfavorite(input: AuthorRepositoryUnfavoriteInput): Promise<void>;

  public abstract isFavorited(input: AuthorRepositoryIsFavoritedInput): Promise<boolean>;

  public abstract tag(input: AuthorRepositoryTagInput): Promise<void>;

  public abstract untag(input: AuthorRepositoryUntagInput): Promise<void>;

  public abstract isTagged(input: AuthorRepositoryIsTaggedInput): Promise<boolean>;

  public abstract findUniqueOrThrow(input: AuthorRepositoryFindUniqueOrThrowInput): Promise<Author>;

  public abstract findManyPaginated(input: AuthorRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Author>>;

  public abstract findMany(input?: AuthorRepositoryFindManyInput): Promise<Author[]>;

  public abstract findManyFavoritedByUser(input: AuthorRepositoryFindManyFavoritedByUserInput): Promise<Author[]>;

  public abstract findManyByTag(input: AuthorRepositoryFindManyByTagInput): Promise<Author[]>;

  public abstract delete(input: AuthorRepositoryDeleteInput): Promise<void>;
}

export { AuthorRepositoryContract };

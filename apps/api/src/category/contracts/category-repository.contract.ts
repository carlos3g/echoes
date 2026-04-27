import type {
  CategoryRepositoryCreateInput,
  CategoryRepositoryDeleteInput,
  CategoryRepositoryFindManyInput,
  CategoryRepositoryFindManyPaginatedInput,
  CategoryRepositoryFindUniqueOrThrowInput,
  CategoryRepositoryUpdateInput,
} from '@app/category/dtos/category-repository-dtos';
import type { Category } from '@app/category/entities/category.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';

abstract class CategoryRepositoryContract {
  public abstract create(input: CategoryRepositoryCreateInput): Promise<Category>;

  public abstract update(input: CategoryRepositoryUpdateInput): Promise<Category>;

  public abstract findUniqueOrThrow(input: CategoryRepositoryFindUniqueOrThrowInput): Promise<Category>;

  public abstract findManyPaginated(
    input: CategoryRepositoryFindManyPaginatedInput
  ): Promise<PaginatedResult<Category>>;

  public abstract findMany(input?: CategoryRepositoryFindManyInput): Promise<Category[]>;

  public abstract delete(input: CategoryRepositoryDeleteInput): Promise<void>;
}

export { CategoryRepositoryContract };

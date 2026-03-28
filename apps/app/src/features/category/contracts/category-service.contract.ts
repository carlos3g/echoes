import type { ApiPaginatedResult, Paginate } from '@/types/api';
import type { Category } from '@/types/entities';

export type ListCategoriesPayload = {
  paginate?: Paginate;
};

export type ListCategoriesOutput = ApiPaginatedResult<Category>;

export abstract class CategoryServiceContract {
  public abstract list(payload: ListCategoriesPayload): Promise<ListCategoriesOutput>;
}

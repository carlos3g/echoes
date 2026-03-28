import type { ApiPaginatedResult, Paginate } from '@/types/api';
import type { Author } from '@/types/entities';

export type ListAuthorsPayload = {
  paginate?: Paginate;
  filters?: {
    search?: string;
  };
};

export type ListAuthorsOutput = ApiPaginatedResult<Author>;

export abstract class AuthorServiceContract {
  public abstract list(payload: ListAuthorsPayload): Promise<ListAuthorsOutput>;

  public abstract get(uuid: string): Promise<Author>;
}

export interface ApiPaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface ApiResponse<TData = never> {
  message?: string;
  data: TData;
  description?: string;
}

export interface ApiResponseError<TPayload = unknown> {
  message: string;
  errors?: Record<keyof TPayload, string[]>;
}

export interface ApiPaginatedRequestQueryParams {
  page?: number;
  perPage?: number;
}

export class Paginate {
  public page?: number;

  public perPage?: number;
}

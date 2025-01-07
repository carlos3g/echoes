import type { ApiPaginatedResult, Paginate } from '@/types/api';
import type { Tag } from '@/types/entities';

export type CreateTagPayload = {
  title: string;
};

export type CreateTagOutput = Tag;

export type ListTagsPayload = {
  paginate?: Paginate;
  page?: number;
};

export type ListTagsOutput = ApiPaginatedResult<Tag>;

export abstract class TagServiceContract {
  public abstract list(payload: ListTagsPayload): Promise<ListTagsOutput>;

  public abstract create(payload: CreateTagPayload): Promise<CreateTagOutput>;
}

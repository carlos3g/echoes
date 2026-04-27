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

export type UpdateTagPayload = {
  title: string;
};

export type UpdateTagOutput = Tag;

export type DeleteTagOutput = void;

export abstract class TagServiceContract {
  public abstract list(payload: ListTagsPayload): Promise<ListTagsOutput>;

  public abstract create(payload: CreateTagPayload): Promise<CreateTagOutput>;

  public abstract update(uuid: string, payload: UpdateTagPayload): Promise<UpdateTagOutput>;

  public abstract delete(uuid: string): Promise<DeleteTagOutput>;
}

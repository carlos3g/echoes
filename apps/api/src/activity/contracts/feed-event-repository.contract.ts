import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type {
  FeedEventRepositoryCreateInput,
  FeedEventRepositoryFindManyPaginatedInput,
} from '@app/activity/dtos/feed-event-repository-dtos';

export interface FeedEventOutput {
  type: string;
  actorId: number;
  folderId: number | null;
  quoteId: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

abstract class FeedEventRepositoryContract {
  public abstract create(input: FeedEventRepositoryCreateInput): Promise<void>;

  public abstract findManyPaginated(
    input: FeedEventRepositoryFindManyPaginatedInput
  ): Promise<PaginatedResult<FeedEventOutput>>;
}

export { FeedEventRepositoryContract };

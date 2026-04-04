import type { Paginate } from '@app/shared/dtos/paginate';

export const FEED_EVENT_TYPES = {
  QUOTE_ADDED_TO_FOLDER: 'quote_added_to_folder',
} as const;

export type FeedEventType = (typeof FEED_EVENT_TYPES)[keyof typeof FEED_EVENT_TYPES];

export interface FeedEventRepositoryCreateInput {
  type: FeedEventType;
  actorId: number;
  folderId?: number;
  quoteId?: number;
  metadata?: Record<string, unknown>;
}

export interface FeedEventRepositoryFindManyPaginatedInput {
  followerUserId: number;
  options?: Paginate;
}

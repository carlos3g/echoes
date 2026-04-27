export type ActivityItem = {
  type: 'favorite_quote' | 'favorite_author' | 'share' | 'tag_created';
  timestamp: Date;
  quoteUuid: string | null;
  quoteContent: string | null;
  authorName: string | null;
  authorUuid: string | null;
  tagUuid: string | null;
  tagTitle: string | null;
  platform: string | null;
};

export type ListActivityPaginatedResult = {
  data: ActivityItem[];
  hasMore: boolean;
};

abstract class ActivityRepositoryContract {
  public abstract listPaginated(userId: number, page: number, perPage: number): Promise<ListActivityPaginatedResult>;
}

export { ActivityRepositoryContract };

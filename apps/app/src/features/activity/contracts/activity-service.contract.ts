export type ActivityType = 'favorite_quote' | 'favorite_author' | 'share' | 'tag_created';

export interface ActivityItemResponse {
  type: ActivityType;
  timestamp: string;
  quote?: { uuid: string; content: string; author: string };
  author?: { uuid: string; name: string };
  tag?: { uuid: string; title: string };
  platform?: string;
}

export interface ActivityResponse {
  data: ActivityItemResponse[];
  meta: {
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

export interface GetActivityPayload {
  page?: number;
  perPage?: number;
}

export abstract class ActivityServiceContract {
  public abstract list(payload: GetActivityPayload): Promise<ActivityResponse>;
}

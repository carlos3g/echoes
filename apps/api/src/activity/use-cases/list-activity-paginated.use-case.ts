import { ActivityRepositoryContract } from '@app/activity/contracts/activity-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export type ActivityType = 'favorite_quote' | 'favorite_author' | 'share' | 'tag_created';

export type ListActivityPaginatedInput = {
  page: number;
  perPage: number;
  user: User;
};

export type ActivityOutputItem = {
  type: ActivityType;
  timestamp: Date;
  quote?: { uuid: string; content: string; author: string };
  author?: { uuid: string; name: string };
  tag?: { uuid: string; title: string };
  platform?: string;
};

export type ListActivityPaginatedOutput = {
  data: ActivityOutputItem[];
  meta: {
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
};

@Injectable()
export class ListActivityPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly activityRepository: ActivityRepositoryContract) {}

  public async handle(input: ListActivityPaginatedInput): Promise<ListActivityPaginatedOutput> {
    const { page, perPage, user } = input;

    const result = await this.activityRepository.listPaginated(user.id, page, perPage);

    const data: ActivityOutputItem[] = result.data.map((item) => {
      const base = { type: item.type, timestamp: item.timestamp };

      switch (item.type) {
        case 'favorite_quote':
        case 'share':
          return {
            ...base,
            quote: {
              uuid: item.quoteUuid!,
              content: item.quoteContent!,
              author: item.authorName ?? '',
            },
            ...(item.platform ? { platform: item.platform } : {}),
          };
        case 'favorite_author':
          return {
            ...base,
            author: {
              uuid: item.authorUuid!,
              name: item.authorName!,
            },
          };
        case 'tag_created':
          return {
            ...base,
            tag: {
              uuid: item.tagUuid!,
              title: item.tagTitle!,
            },
          };
      }
    });

    return {
      data,
      meta: {
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: result.hasMore ? page + 1 : null,
      },
    };
  }
}

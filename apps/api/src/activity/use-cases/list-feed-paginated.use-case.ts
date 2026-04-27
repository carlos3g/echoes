import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import {
  FeedEventRepositoryContract,
  type FeedEventOutput,
} from '@app/activity/contracts/feed-event-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import type { Paginate } from '@app/shared/dtos/paginate';
import { Injectable } from '@nestjs/common';

export interface ListFeedPaginatedInput {
  user: User;
  paginate?: Paginate;
}

@Injectable()
export class ListFeedPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly feedEventRepository: FeedEventRepositoryContract) {}

  public async handle(input: ListFeedPaginatedInput): Promise<PaginatedResult<FeedEventOutput>> {
    const { user, paginate } = input;

    return this.feedEventRepository.findManyPaginated({
      followerUserId: user.id,
      options: paginate,
    });
  }
}

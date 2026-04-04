import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import type {
  FeedEventRepositoryContract,
  FeedEventOutput,
} from '@app/activity/contracts/feed-event-repository.contract';
import type {
  FeedEventRepositoryCreateInput,
  FeedEventRepositoryFindManyPaginatedInput,
} from '@app/activity/dtos/feed-event-repository-dtos';
import { Injectable } from '@nestjs/common';
import type { FeedEvent } from '@generated/prisma/client';

@Injectable()
export class PrismaFeedEventRepository implements FeedEventRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async create(input: FeedEventRepositoryCreateInput): Promise<void> {
    const { metadata, ...rest } = input;

    await this.prismaManager.getClient().feedEvent.create({
      data: {
        ...rest,
        ...(metadata !== undefined ? { metadata: metadata as object } : {}),
      },
    });
  }

  public async findManyPaginated(
    input: FeedEventRepositoryFindManyPaginatedInput
  ): Promise<PaginatedResult<FeedEventOutput>> {
    const { perPage = 20, page = 1 } = input.options || {};

    // Get folder IDs the user follows
    const follows = await this.prismaManager.getClient().folderFollow.findMany({
      where: { userId: input.followerUserId },
      select: { folderId: true },
    });

    const followedFolderIds = follows.map((f) => f.folderId);

    if (followedFolderIds.length === 0) {
      return {
        data: [],
        meta: { total: 0, lastPage: 0, currentPage: page, perPage, prev: null, next: null },
      };
    }

    const result = await paginate<FeedEvent, 'FeedEvent'>(
      this.prismaManager.getClient().feedEvent,
      {
        where: { folderId: { in: followedFolderIds } },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map((e) => ({
        type: e.type,
        actorId: Number(e.actorId),
        folderId: e.folderId ? Number(e.folderId) : null,
        quoteId: e.quoteId ? Number(e.quoteId) : null,
        metadata: e.metadata as Record<string, unknown> | null,
        createdAt: e.createdAt,
      })),
    };
  }
}

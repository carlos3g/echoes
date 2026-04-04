import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaFolderToFolderAdapter } from '@app/folder/adapters';
import type { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import type {
  FolderRepositoryCountFollowersBatchInput,
  FolderRepositoryCountFollowersInput,
  FolderRepositoryCountQuotesBatchInput,
  FolderRepositoryCountQuotesInput,
  FolderRepositoryCreateInput,
  FolderRepositoryDeleteInput,
  FolderRepositoryFindManyPaginatedInput,
  FolderRepositoryFindUniqueOrThrowInput,
  FolderRepositoryPopularPaginatedInput,
  FolderRepositorySearchPaginatedInput,
  FolderRepositoryUpdateInput,
  FolderRepositoryUserPublicPaginatedInput,
} from '@app/folder/dtos/folder-repository-dtos';
import type { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';
import type { Folder as PrismaFolder } from '@generated/prisma/client';

type FindManyReturn = PrismaFolder;

@Injectable()
export class PrismaFolderRepository implements FolderRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: FolderRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().folder.findUniqueOrThrow({
      where: input.where,
    });

    return prismaFolderToFolderAdapter(entity);
  }

  public async findManyPaginated(input: FolderRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Folder>> {
    const where = input.where || {};
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FindManyReturn, 'Folder'>(
      this.prismaManager.getClient().folder,
      {
        where,
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map(prismaFolderToFolderAdapter),
    };
  }

  public async create(input: FolderRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().folder.create({
      data: input,
    });

    return prismaFolderToFolderAdapter(entity);
  }

  public async update(input: FolderRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().folder.update({
      where: input.where,
      data: input.data,
    });

    return prismaFolderToFolderAdapter(entity);
  }

  public async countQuotes(input: FolderRepositoryCountQuotesInput): Promise<number> {
    return this.prismaManager.getClient().folderQuote.count({
      where: { folderId: input.folderId },
    });
  }

  public async countFollowers(input: FolderRepositoryCountFollowersInput): Promise<number> {
    return this.prismaManager.getClient().folderFollow.count({
      where: { folderId: input.folderId },
    });
  }

  public async countQuotesBatch(input: FolderRepositoryCountQuotesBatchInput): Promise<Map<number, number>> {
    const results = await this.prismaManager.getClient().folderQuote.groupBy({
      by: ['folderId'],
      where: { folderId: { in: input.folderIds } },
      _count: { folderId: true },
    });

    const map = new Map<number, number>();
    for (const r of results) {
      map.set(Number(r.folderId), r._count.folderId);
    }
    return map;
  }

  public async countFollowersBatch(input: FolderRepositoryCountFollowersBatchInput): Promise<Map<number, number>> {
    const results = await this.prismaManager.getClient().folderFollow.groupBy({
      by: ['folderId'],
      where: { folderId: { in: input.folderIds } },
      _count: { folderId: true },
    });

    const map = new Map<number, number>();
    for (const r of results) {
      map.set(Number(r.folderId), r._count.folderId);
    }
    return map;
  }

  public async findManyByUuids(uuids: string[]): Promise<Folder[]> {
    const entities = await this.prismaManager.getClient().folder.findMany({
      where: { uuid: { in: uuids } },
    });

    return entities.map(prismaFolderToFolderAdapter);
  }

  public async delete(input: FolderRepositoryDeleteInput): Promise<void> {
    await this.prismaManager.getClient().folder.delete({ where: input.where });
  }

  public async searchPaginated(input: FolderRepositorySearchPaginatedInput): Promise<PaginatedResult<Folder>> {
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FindManyReturn, 'Folder'>(
      this.prismaManager.getClient().folder,
      {
        where: {
          visibility: 'PUBLIC',
          name: { contains: input.query, mode: 'insensitive' },
          ...(input.excludeUserId ? { userId: { not: input.excludeUserId } } : {}),
        },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map(prismaFolderToFolderAdapter),
    };
  }

  public async popularPaginated(input: FolderRepositoryPopularPaginatedInput): Promise<PaginatedResult<Folder>> {
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FindManyReturn, 'Folder'>(
      this.prismaManager.getClient().folder,
      {
        where: {
          visibility: 'PUBLIC',
          ...(input.excludeUserId ? { userId: { not: input.excludeUserId } } : {}),
        },
        orderBy: { follows: { _count: 'desc' } },
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map(prismaFolderToFolderAdapter),
    };
  }

  public async userPublicPaginated(input: FolderRepositoryUserPublicPaginatedInput): Promise<PaginatedResult<Folder>> {
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FindManyReturn, 'Folder'>(
      this.prismaManager.getClient().folder,
      {
        where: {
          userId: input.userId,
          visibility: 'PUBLIC',
        },
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map(prismaFolderToFolderAdapter),
    };
  }
}

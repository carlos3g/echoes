import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import type {
  FolderFollowRepositoryContract,
  FolderFollower,
} from '@app/folder/contracts/folder-follow-repository.contract';
import type {
  FolderFollowRepositoryCreateInput,
  FolderFollowRepositoryDeleteInput,
  FolderFollowRepositoryDeleteManyInput,
  FolderFollowRepositoryExistsInput,
  FolderFollowRepositoryFindManyPaginatedInput,
} from '@app/folder/dtos/folder-follow-repository-dtos';
import { Injectable } from '@nestjs/common';
import type { FolderFollow } from '@generated/prisma/client';

@Injectable()
export class PrismaFolderFollowRepository implements FolderFollowRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async create(input: FolderFollowRepositoryCreateInput): Promise<void> {
    await this.prismaManager.getClient().folderFollow.create({
      data: input,
    });
  }

  public async delete(input: FolderFollowRepositoryDeleteInput): Promise<void> {
    await this.prismaManager.getClient().folderFollow.deleteMany({
      where: input.where,
    });
  }

  public async deleteMany(input: FolderFollowRepositoryDeleteManyInput): Promise<void> {
    await this.prismaManager.getClient().folderFollow.deleteMany({
      where: input.where,
    });
  }

  public async exists(input: FolderFollowRepositoryExistsInput): Promise<boolean> {
    const count = await this.prismaManager.getClient().folderFollow.count({
      where: input.where,
    });
    return count > 0;
  }

  public async findManyPaginated(
    input: FolderFollowRepositoryFindManyPaginatedInput
  ): Promise<PaginatedResult<FolderFollower>> {
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FolderFollow, 'FolderFollow'>(
      this.prismaManager.getClient().folderFollow,
      {
        where: { folderId: input.where.folderId },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page, perPage }
    );

    return {
      ...result,
      data: result.data.map((f) => ({
        userId: Number(f.userId),
        createdAt: f.createdAt,
      })),
    };
  }
}

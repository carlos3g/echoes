import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { calcSkip, getMeta } from '@app/lib/prisma/helpers/pagination';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { prismaFolderToFolderAdapter } from '@app/folder/adapters';
import type {
  SavedFolderCreateInput,
  SavedFolderDeleteInput,
  SavedFolderExistsInput,
  SavedFolderListInput,
} from '@app/user/contracts/saved-folder-repository.contract';
import { SavedFolderRepositoryContract } from '@app/user/contracts/saved-folder-repository.contract';
import type { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaSavedFolderRepository implements SavedFolderRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async exists(input: SavedFolderExistsInput): Promise<boolean> {
    const count = await this.prismaManager.getClient().savedFolder.count({
      where: { userId: input.userId, folderId: input.folderId },
    });
    return count > 0;
  }

  public async create(input: SavedFolderCreateInput): Promise<void> {
    await this.prismaManager.getClient().savedFolder.create({
      data: { userId: input.userId, folderId: input.folderId },
    });
  }

  public async delete(input: SavedFolderDeleteInput): Promise<void> {
    await this.prismaManager.getClient().savedFolder.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        userId_folderId: {
          userId: input.userId,
          folderId: input.folderId,
        },
      },
    });
  }

  public async listByUser(input: SavedFolderListInput): Promise<PaginatedResult<Folder>> {
    const { userId, options } = input;
    const page = options?.page ?? 1;
    const perPage = options?.perPage ?? 20;

    const [total, savedFolders] = await Promise.all([
      this.prismaManager.getClient().savedFolder.count({ where: { userId } }),
      this.prismaManager.getClient().savedFolder.findMany({
        where: { userId },
        include: { folder: true },
        orderBy: { createdAt: 'desc' },
        take: perPage,
        skip: calcSkip(page, perPage),
      }),
    ]);

    return {
      data: savedFolders.map((sf) => prismaFolderToFolderAdapter(sf.folder)),
      meta: getMeta(total, page, perPage),
    };
  }
}

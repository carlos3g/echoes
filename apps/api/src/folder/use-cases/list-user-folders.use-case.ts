import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderService } from '@app/folder/services/folder.service';
import type { FolderPaginatedInput } from '@app/folder/dtos/folder-paginated-input';
import { Folder } from '@app/folder/entities/folder.entity';
import { SavedFolderRepositoryContract } from '@app/user/contracts/saved-folder-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUserFoldersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly folderService: FolderService,
    private readonly savedFolderRepository: SavedFolderRepositoryContract
  ) {}

  public async handle(input: FolderPaginatedInput): Promise<PaginatedResult<Folder>> {
    const { paginate, user } = input;
    const isFirstPage = !paginate?.page || paginate.page === 1;

    const [memberships, result, savedResult] = await Promise.all([
      this.folderMemberRepository.findMany({ where: { userId: user.id } }),
      this.folderRepository.findManyPaginated({ where: { userId: user.id }, options: paginate }),
      isFirstPage
        ? this.savedFolderRepository.listByUser({ userId: user.id })
        : Promise.resolve({
            data: [],
            meta: { total: 0, lastPage: 1, currentPage: 1, perPage: 20, prev: null, next: null },
          }),
    ]);

    const memberRoleMap = new Map(memberships.map((m) => [m.folderId, m.role]));

    const [enrichedOwn, enrichedSaved] = await Promise.all([
      this.folderService.enrichWithMetadata(result.data, { memberRoleMap }),
      this.folderService.enrichWithMetadata(savedResult.data),
    ]);

    const markSaved = (folders: Folder[], isSaved: boolean) =>
      folders.map((folder) => new Folder({ ...folder, metadata: { ...folder.metadata, isSaved } }));

    return {
      ...result,
      data: [...markSaved(enrichedOwn, false), ...markSaved(enrichedSaved, true)],
    };
  }
}

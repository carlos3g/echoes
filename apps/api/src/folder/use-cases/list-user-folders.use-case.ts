import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderService } from '@app/folder/services/folder.service';
import type { FolderPaginatedInput } from '@app/folder/dtos/folder-paginated-input';
import type { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListUserFoldersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly folderService: FolderService
  ) {}

  public async handle(input: FolderPaginatedInput): Promise<PaginatedResult<Folder>> {
    const { paginate, user } = input;

    const [memberships, result] = await Promise.all([
      this.folderMemberRepository.findMany({ where: { userId: user.id } }),
      this.folderRepository.findManyPaginated({ where: { userId: user.id }, options: paginate }),
    ]);

    const memberRoleMap = new Map(memberships.map((m) => [m.folderId, m.role]));

    return {
      ...result,
      data: await this.folderService.enrichWithMetadata(result.data, { memberRoleMap }),
    };
  }
}

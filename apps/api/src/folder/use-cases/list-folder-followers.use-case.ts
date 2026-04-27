import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import {
  FolderFollowRepositoryContract,
  type FolderFollower,
} from '@app/folder/contracts/folder-follow-repository.contract';
import type { ListFolderFollowersInput } from '@app/folder/dtos/list-folder-followers-input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListFolderFollowersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderFollowRepository: FolderFollowRepositoryContract
  ) {}

  public async handle(input: ListFolderFollowersInput): Promise<PaginatedResult<FolderFollower>> {
    const { folderUuid, paginate } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    return this.folderFollowRepository.findManyPaginated({
      where: { folderId: folder.id },
      options: paginate,
    });
  }
}

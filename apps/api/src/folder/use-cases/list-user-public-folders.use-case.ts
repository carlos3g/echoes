import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderService } from '@app/folder/services/folder.service';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { Folder } from '@app/folder/entities/folder.entity';
import type { Paginate } from '@app/shared/dtos/paginate';
import { Injectable } from '@nestjs/common';

export interface ListUserPublicFoldersInput {
  username: string;
  paginate?: Paginate;
}

@Injectable()
export class ListUserPublicFoldersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly userRepository: UserRepositoryContract,
    private readonly folderService: FolderService
  ) {}

  public async handle(input: ListUserPublicFoldersInput): Promise<PaginatedResult<Folder>> {
    const { username, paginate } = input;

    const user = await this.userRepository.findUniqueOrThrow({ where: { username } });

    const result = await this.folderRepository.userPublicPaginated({
      userId: user.id,
      options: paginate,
    });

    return {
      ...result,
      data: await this.folderService.enrichWithMetadata(result.data),
    };
  }
}

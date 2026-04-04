import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderService } from '@app/folder/services/folder.service';
import type { Folder } from '@app/folder/entities/folder.entity';
import type { Paginate } from '@app/shared/dtos/paginate';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface PopularFoldersInput {
  paginate?: Paginate;
  user?: User;
}

@Injectable()
export class PopularFoldersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderService: FolderService
  ) {}

  public async handle(input: PopularFoldersInput): Promise<PaginatedResult<Folder>> {
    const result = await this.folderRepository.popularPaginated({
      excludeUserId: input.user?.id,
      options: input.paginate,
    });

    return {
      ...result,
      data: await this.folderService.enrichWithMetadata(result.data),
    };
  }
}

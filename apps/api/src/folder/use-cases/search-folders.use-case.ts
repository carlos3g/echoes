import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderService } from '@app/folder/services/folder.service';
import type { SearchFoldersInput } from '@app/folder/dtos/search-folders-input';
import type { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchFoldersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderService: FolderService
  ) {}

  public async handle(input: SearchFoldersInput): Promise<PaginatedResult<Folder>> {
    const { query, paginate, user } = input;

    const result = await this.folderRepository.searchPaginated({
      query,
      excludeUserId: user?.id,
      options: paginate,
    });

    return {
      ...result,
      data: await this.folderService.enrichWithMetadata(result.data),
    };
  }
}

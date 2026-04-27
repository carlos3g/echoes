import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderQuoteRepositoryContract } from '@app/folder/contracts/folder-quote-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { ListFolderQuotesInput } from '@app/folder/dtos/list-folder-quotes-input';
import type { Quote } from '@app/quote/entities/quote.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListFolderQuotesUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderQuoteRepository: FolderQuoteRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: ListFolderQuotesInput): Promise<PaginatedResult<Quote>> {
    const { folderUuid, user, paginate } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    await this.folderAuthorization.assertCanViewFolder(user?.id, folder);

    return this.folderQuoteRepository.findManyPaginated({
      where: { folderId: folder.id },
      options: paginate,
    });
  }
}

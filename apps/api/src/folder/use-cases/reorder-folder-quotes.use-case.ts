import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderQuoteRepositoryContract } from '@app/folder/contracts/folder-quote-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { ReorderFolderQuotesInput } from '@app/folder/dtos/reorder-folder-quotes-input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReorderFolderQuotesUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderQuoteRepository: FolderQuoteRepositoryContract,
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: ReorderFolderQuotesInput): Promise<void> {
    const { folderUuid, orderedQuoteUuids, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    await this.folderAuthorization.assertCanEditFolder(user.id, folder.id);

    const quotes = await this.quoteRepository.findManyByUuids(orderedQuoteUuids);
    const quoteIdByUuid = new Map(quotes.map((q) => [q.uuid, q.id]));
    const orderedQuoteIds = orderedQuoteUuids.map((uuid) => quoteIdByUuid.get(uuid)!);

    await this.folderQuoteRepository.updatePositions({
      folderId: folder.id,
      orderedQuoteIds,
    });
  }
}

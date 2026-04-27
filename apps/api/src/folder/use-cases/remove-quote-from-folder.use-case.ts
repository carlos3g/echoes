import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderQuoteRepositoryContract } from '@app/folder/contracts/folder-quote-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import type { RemoveQuoteFromFolderInput } from '@app/folder/dtos/remove-quote-from-folder-input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveQuoteFromFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderQuoteRepository: FolderQuoteRepositoryContract,
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: RemoveQuoteFromFolderInput): Promise<void> {
    const { folderUuid, quoteUuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });
    const quote = await this.quoteRepository.findUniqueOrThrow({ where: { uuid: quoteUuid } });

    await this.folderAuthorization.assertCanEditFolder(user.id, folder.id);

    await this.folderQuoteRepository.delete({
      where: { folderId: folder.id, quoteId: quote.id },
    });
  }
}

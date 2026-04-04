import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderQuoteRepositoryContract } from '@app/folder/contracts/folder-quote-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { FeedEventRepositoryContract } from '@app/activity/contracts/feed-event-repository.contract';
import { FEED_EVENT_TYPES } from '@app/activity/dtos/feed-event-repository-dtos';
import type { AddQuoteToFolderInput } from '@app/folder/dtos/add-quote-to-folder-input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AddQuoteToFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderQuoteRepository: FolderQuoteRepositoryContract,
    private readonly quoteRepository: QuoteRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService,
    private readonly feedEventRepository: FeedEventRepositoryContract
  ) {}

  public async handle(input: AddQuoteToFolderInput): Promise<void> {
    const { folderUuid, quoteUuid, user } = input;

    const [folder, quote] = await Promise.all([
      this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } }),
      this.quoteRepository.findUniqueOrThrow({ where: { uuid: quoteUuid } }),
    ]);

    await this.folderAuthorization.assertCanEditFolder(user.id, folder.id);

    const alreadyExists = await this.folderQuoteRepository.exists({
      where: { folderId: folder.id, quoteId: quote.id },
    });

    if (alreadyExists) {
      return;
    }

    const maxPosition = await this.folderQuoteRepository.getMaxPosition(folder.id);

    await this.folderQuoteRepository.create({
      folderId: folder.id,
      quoteId: quote.id,
      addedById: user.id,
      position: maxPosition + 1,
    });

    await this.feedEventRepository.create({
      type: FEED_EVENT_TYPES.QUOTE_ADDED_TO_FOLDER,
      actorId: user.id,
      folderId: folder.id,
      quoteId: quote.id,
    });
  }
}

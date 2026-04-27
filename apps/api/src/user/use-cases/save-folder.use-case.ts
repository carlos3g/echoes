import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { SavedFolderRepositoryContract } from '@app/user/contracts/saved-folder-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface SaveFolderInput {
  user: User;
  folderUuid: string;
}

@Injectable()
export class SaveFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly savedFolderRepository: SavedFolderRepositoryContract
  ) {}

  public async handle(input: SaveFolderInput): Promise<void> {
    const { user, folderUuid } = input;
    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    if (folder.visibility !== 'PUBLIC') {
      throw new BadRequestException('Can only save public folders');
    }

    if (folder.userId === user.id) {
      throw new BadRequestException('Cannot save your own folder');
    }

    const alreadySaved = await this.savedFolderRepository.exists({
      userId: user.id,
      folderId: folder.id,
    });

    if (alreadySaved) {
      return;
    }

    await this.savedFolderRepository.create({ userId: user.id, folderId: folder.id });
  }
}

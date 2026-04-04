import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { SavedFolderRepositoryContract } from '@app/user/contracts/saved-folder-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface UnsaveFolderInput {
  user: User;
  folderUuid: string;
}

@Injectable()
export class UnsaveFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly savedFolderRepository: SavedFolderRepositoryContract
  ) {}

  public async handle(input: UnsaveFolderInput): Promise<void> {
    const { user, folderUuid } = input;
    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    const isSaved = await this.savedFolderRepository.exists({
      userId: user.id,
      folderId: folder.id,
    });

    if (!isSaved) {
      return;
    }

    await this.savedFolderRepository.delete({ userId: user.id, folderId: folder.id });
  }
}

import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderFollowRepositoryContract } from '@app/folder/contracts/folder-follow-repository.contract';
import type { FollowFolderInput } from '@app/folder/dtos/follow-folder-input';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FollowFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderFollowRepository: FolderFollowRepositoryContract
  ) {}

  public async handle(input: FollowFolderInput): Promise<void> {
    const { folderUuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    if (folder.visibility !== 'PUBLIC') {
      throw new BadRequestException('Can only follow public folders');
    }

    const alreadyFollowing = await this.folderFollowRepository.exists({
      where: { folderId: folder.id, userId: user.id },
    });

    if (alreadyFollowing) {
      return;
    }

    await this.folderFollowRepository.create({ folderId: folder.id, userId: user.id });
  }
}

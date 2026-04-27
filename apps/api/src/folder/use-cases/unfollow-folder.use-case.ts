import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderFollowRepositoryContract } from '@app/folder/contracts/folder-follow-repository.contract';
import type { FollowFolderInput } from '@app/folder/dtos/follow-folder-input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnfollowFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderFollowRepository: FolderFollowRepositoryContract
  ) {}

  public async handle(input: FollowFolderInput): Promise<void> {
    const { folderUuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    await this.folderFollowRepository.delete({
      where: { folderId: folder.id, userId: user.id },
    });
  }
}

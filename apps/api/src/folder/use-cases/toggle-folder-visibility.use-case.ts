import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderFollowRepositoryContract } from '@app/folder/contracts/folder-follow-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { ToggleFolderVisibilityInput } from '@app/folder/dtos/toggle-folder-visibility-input';
import type { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ToggleFolderVisibilityUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderFollowRepository: FolderFollowRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: ToggleFolderVisibilityInput): Promise<Folder> {
    const { uuid, visibility, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid } });

    await this.folderAuthorization.assertCanManageFolder(user.id, folder.id);

    if (visibility === 'PRIVATE') {
      await this.folderFollowRepository.deleteMany({ where: { folderId: folder.id } });
    }

    return this.folderRepository.update({
      where: { uuid },
      data: { visibility },
    });
  }
}

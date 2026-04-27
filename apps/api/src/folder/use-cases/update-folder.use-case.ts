import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { UpdateFolderInput } from '@app/folder/dtos/update-folder-input';
import type { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: UpdateFolderInput): Promise<Folder> {
    const { uuid, user, ...data } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid } });

    await this.folderAuthorization.assertCanManageFolder(user.id, folder.id);

    return this.folderRepository.update({
      where: { uuid },
      data,
    });
  }
}

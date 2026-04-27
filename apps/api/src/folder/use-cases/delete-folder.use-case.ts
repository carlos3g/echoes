import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { DeleteFolderInput } from '@app/folder/dtos/delete-folder-input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeleteFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: DeleteFolderInput): Promise<void> {
    const { uuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid } });

    await this.folderAuthorization.assertCanManageFolder(user.id, folder.id);

    await this.folderRepository.delete({ where: { uuid } });
  }
}

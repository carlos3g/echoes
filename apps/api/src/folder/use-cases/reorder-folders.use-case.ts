import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import type { ReorderFoldersInput } from '@app/folder/dtos/reorder-folders-input';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class ReorderFoldersUseCase implements UseCaseHandler {
  public constructor(private readonly folderRepository: FolderRepositoryContract) {}

  public async handle(input: ReorderFoldersInput): Promise<void> {
    const { orderedUuids, user } = input;

    const folders = await this.folderRepository.findManyByUuids(orderedUuids);

    if (folders.some((f) => f.userId !== user.id)) {
      throw new ForbiddenException();
    }

    const folderIdByUuid = new Map(folders.map((f) => [f.uuid, f.id]));

    const updates = orderedUuids.map((uuid, index) =>
      this.folderRepository.update({
        where: { id: folderIdByUuid.get(uuid)! },
        data: { position: index },
      })
    );

    await Promise.all(updates);
  }
}

import { createUuidV4 } from '@app/shared/utils';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import type { FolderServiceCreate } from '@app/folder/dtos/folder-service-dtos';
import { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FolderService {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract
  ) {}

  public async create(input: FolderServiceCreate) {
    const folder = await this.folderRepository.create({ ...input, uuid: createUuidV4() });

    await this.folderMemberRepository.create({
      folderId: folder.id,
      userId: input.userId,
      role: 'OWNER',
    });

    return folder;
  }

  public async enrichWithMetadata(
    folders: Folder[],
    options?: { memberRoleMap?: Map<number, 'OWNER' | 'EDITOR' | 'VIEWER'> }
  ): Promise<Folder[]> {
    if (folders.length === 0) return [];

    const folderIds = folders.map((f) => f.id);

    const [quotesMap, followersMap] = await Promise.all([
      this.folderRepository.countQuotesBatch({ folderIds }),
      this.folderRepository.countFollowersBatch({ folderIds }),
    ]);

    return folders.map(
      (folder) =>
        new Folder({
          ...folder,
          metadata: {
            totalQuotes: quotesMap.get(folder.id) ?? 0,
            totalFollowers: followersMap.get(folder.id) ?? 0,
            memberRole: options?.memberRoleMap?.get(folder.id) ?? null,
          },
        })
    );
  }
}

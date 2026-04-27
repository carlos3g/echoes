import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import type { Folder } from '@app/folder/entities/folder.entity';
import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class FolderAuthorizationService {
  public constructor(private readonly folderMemberRepository: FolderMemberRepositoryContract) {}

  public async assertCanManageFolder(userId: number, folderId: number): Promise<void> {
    const member = await this.folderMemberRepository.find({
      where: { folderId, userId },
    });

    if (!member || member.role !== 'OWNER') {
      throw new ForbiddenException();
    }
  }

  public async assertCanEditFolder(userId: number, folderId: number): Promise<void> {
    const member = await this.folderMemberRepository.find({
      where: { folderId, userId },
    });

    if (!member || (member.role !== 'OWNER' && member.role !== 'EDITOR')) {
      throw new ForbiddenException();
    }
  }

  public async assertCanViewFolder(userId: number | undefined, folder: Folder): Promise<void> {
    if (folder.visibility === 'PUBLIC') {
      return;
    }

    if (!userId) {
      throw new ForbiddenException();
    }

    const member = await this.folderMemberRepository.find({
      where: { folderId: folder.id, userId },
    });

    if (!member) {
      throw new ForbiddenException();
    }
  }
}

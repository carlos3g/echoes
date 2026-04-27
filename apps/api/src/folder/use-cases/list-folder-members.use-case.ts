import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { ListFolderMembersInput } from '@app/folder/dtos/list-folder-members-input';
import type { FolderMember } from '@app/folder/entities/folder-member.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListFolderMembersUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: ListFolderMembersInput): Promise<FolderMember[]> {
    const { folderUuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    const member = await this.folderMemberRepository.find({
      where: { folderId: folder.id, userId: user.id },
    });

    if (!member) {
      await this.folderAuthorization.assertCanViewFolder(user.id, folder);
    }

    return this.folderMemberRepository.findManyWithUser({ where: { folderId: folder.id } });
  }
}

import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import type { LeaveFolderInput } from '@app/folder/dtos/leave-folder-input';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class LeaveFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract
  ) {}

  public async handle(input: LeaveFolderInput): Promise<void> {
    const { folderUuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    const member = await this.folderMemberRepository.find({
      where: { folderId: folder.id, userId: user.id },
    });

    if (!member) {
      throw new BadRequestException('Not a member');
    }

    if (member.role === 'OWNER') {
      throw new BadRequestException('Owner cannot leave folder');
    }

    await this.folderMemberRepository.delete({
      where: { folderId: folder.id, userId: user.id },
    });
  }
}

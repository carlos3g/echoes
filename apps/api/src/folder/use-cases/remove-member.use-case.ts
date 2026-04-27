import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { RemoveMemberInput } from '@app/folder/dtos/remove-member-input';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RemoveMemberUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService,
    private readonly userRepository: UserRepositoryContract
  ) {}

  public async handle(input: RemoveMemberInput): Promise<void> {
    const { folderUuid, memberUserUuid, user } = input;
    const targetUser = await this.userRepository.findUniqueOrThrow({ where: { uuid: memberUserUuid } });
    const memberUserId = targetUser.id;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    await this.folderAuthorization.assertCanManageFolder(user.id, folder.id);

    const targetMember = await this.folderMemberRepository.find({
      where: { folderId: folder.id, userId: memberUserId },
    });

    if (!targetMember) {
      throw new BadRequestException('Member not found');
    }

    if (targetMember.role === 'OWNER') {
      throw new BadRequestException('Cannot remove owner');
    }

    await this.folderMemberRepository.delete({
      where: { folderId: folder.id, userId: memberUserId },
    });
  }
}

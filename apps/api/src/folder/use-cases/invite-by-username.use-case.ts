import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { InviteByUsernameInput } from '@app/folder/dtos/invite-member-input';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class InviteByUsernameUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly userRepository: UserRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: InviteByUsernameInput): Promise<void> {
    const { folderUuid, username, role, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    await this.folderAuthorization.assertCanManageFolder(user.id, folder.id);

    const targetUser = await this.userRepository.findUniqueOrThrow({ where: { username } });

    const existingMember = await this.folderMemberRepository.find({
      where: { folderId: folder.id, userId: targetUser.id },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member');
    }

    await this.folderMemberRepository.create({
      folderId: folder.id,
      userId: targetUser.id,
      role,
    });
  }
}

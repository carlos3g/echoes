import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { UpdateMemberRoleInput } from '@app/folder/dtos/update-member-role-input';
import type { FolderMember } from '@app/folder/entities/folder-member.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateMemberRoleUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService,
    private readonly userRepository: UserRepositoryContract
  ) {}

  public async handle(input: UpdateMemberRoleInput): Promise<FolderMember> {
    const { folderUuid, memberUserUuid, role, user } = input;
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
      throw new BadRequestException('Cannot change owner role');
    }

    return this.folderMemberRepository.update({
      where: { folderId: folder.id, userId: memberUserId },
      data: { role },
    });
  }
}

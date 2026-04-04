import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderInviteLinkRepositoryContract } from '@app/folder/contracts/folder-invite-link-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import type { AcceptInviteInput } from '@app/folder/dtos/accept-invite-input';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AcceptInviteUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderInviteLinkRepository: FolderInviteLinkRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract
  ) {}

  public async handle(input: AcceptInviteInput): Promise<void> {
    const { linkUuid, user } = input;

    const link = await this.folderInviteLinkRepository.findUniqueOrThrow({ where: { uuid: linkUuid } });

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new BadRequestException('Invite link has expired');
    }

    if (link.maxUses !== null && link.usedCount >= link.maxUses) {
      throw new BadRequestException('Invite link has reached max uses');
    }

    const existingMember = await this.folderMemberRepository.find({
      where: { folderId: link.folderId, userId: user.id },
    });

    if (existingMember) {
      throw new BadRequestException('Already a member');
    }

    await this.folderMemberRepository.create({
      folderId: link.folderId,
      userId: user.id,
      role: link.role,
    });

    await this.folderInviteLinkRepository.incrementUsedCount({ id: link.id });
  }
}

import type { UseCaseHandler } from '@app/shared/interfaces';
import { createUuidV4 } from '@app/shared/utils';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderInviteLinkRepositoryContract } from '@app/folder/contracts/folder-invite-link-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { CreateInviteLinkInput } from '@app/folder/dtos/create-invite-link-input';
import type { FolderInviteLink } from '@app/folder/entities/folder-invite-link.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateInviteLinkUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderInviteLinkRepository: FolderInviteLinkRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: CreateInviteLinkInput): Promise<FolderInviteLink> {
    const { folderUuid, role, maxUses, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid: folderUuid } });

    await this.folderAuthorization.assertCanManageFolder(user.id, folder.id);

    return this.folderInviteLinkRepository.create({
      uuid: createUuidV4(),
      folderId: folder.id,
      role,
      createdById: user.id,
      maxUses: maxUses ?? null,
    });
  }
}

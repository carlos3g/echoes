import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaFolderInviteLinkToFolderInviteLinkAdapter } from '@app/folder/adapters';
import type { FolderInviteLinkRepositoryContract } from '@app/folder/contracts/folder-invite-link-repository.contract';
import type {
  FolderInviteLinkRepositoryCreateInput,
  FolderInviteLinkRepositoryFindUniqueOrThrowInput,
  FolderInviteLinkRepositoryIncrementUsedCountInput,
} from '@app/folder/dtos/folder-invite-link-repository-dtos';
import type { FolderInviteLink } from '@app/folder/entities/folder-invite-link.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFolderInviteLinkRepository implements FolderInviteLinkRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async create(input: FolderInviteLinkRepositoryCreateInput): Promise<FolderInviteLink> {
    const entity = await this.prismaManager.getClient().folderInviteLink.create({
      data: input,
    });

    return prismaFolderInviteLinkToFolderInviteLinkAdapter(entity);
  }

  public async findUniqueOrThrow(input: FolderInviteLinkRepositoryFindUniqueOrThrowInput): Promise<FolderInviteLink> {
    const entity = await this.prismaManager.getClient().folderInviteLink.findUniqueOrThrow({
      where: input.where,
    });

    return prismaFolderInviteLinkToFolderInviteLinkAdapter(entity);
  }

  public async incrementUsedCount(input: FolderInviteLinkRepositoryIncrementUsedCountInput): Promise<void> {
    await this.prismaManager.getClient().folderInviteLink.update({
      where: { id: input.id },
      data: { usedCount: { increment: 1 } },
    });
  }
}

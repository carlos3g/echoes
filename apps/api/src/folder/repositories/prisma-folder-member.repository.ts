import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaFolderMemberToFolderMemberAdapter } from '@app/folder/adapters';
import type { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import type {
  FolderMemberRepositoryCreateInput,
  FolderMemberRepositoryDeleteInput,
  FolderMemberRepositoryFindInput,
  FolderMemberRepositoryFindManyInput,
  FolderMemberRepositoryUpdateInput,
} from '@app/folder/dtos/folder-member-repository-dtos';
import type { FolderMember } from '@app/folder/entities/folder-member.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFolderMemberRepository implements FolderMemberRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async create(input: FolderMemberRepositoryCreateInput): Promise<FolderMember> {
    const entity = await this.prismaManager.getClient().folderMember.create({
      data: input,
    });

    return prismaFolderMemberToFolderMemberAdapter(entity);
  }

  public async find(input: FolderMemberRepositoryFindInput): Promise<FolderMember | null> {
    const entity = await this.prismaManager.getClient().folderMember.findFirst({
      where: input.where,
    });

    return entity ? prismaFolderMemberToFolderMemberAdapter(entity) : null;
  }

  public async findMany(input: FolderMemberRepositoryFindManyInput): Promise<FolderMember[]> {
    const entities = await this.prismaManager.getClient().folderMember.findMany({
      where: input.where,
    });

    return entities.map(prismaFolderMemberToFolderMemberAdapter);
  }

  public async findManyWithUser(input: FolderMemberRepositoryFindManyInput): Promise<FolderMember[]> {
    const entities = await this.prismaManager.getClient().folderMember.findMany({
      where: input.where,
      include: { user: { select: { uuid: true, name: true, username: true } } },
    });

    return entities.map((entity) => {
      const member = prismaFolderMemberToFolderMemberAdapter(entity);
      member.user = entity.user;
      return member;
    });
  }

  public async update(input: FolderMemberRepositoryUpdateInput): Promise<FolderMember> {
    await this.prismaManager.getClient().folderMember.updateMany({
      where: input.where,
      data: input.data,
    });

    const updated = await this.prismaManager.getClient().folderMember.findFirstOrThrow({
      where: input.where,
    });

    return prismaFolderMemberToFolderMemberAdapter(updated);
  }

  public async delete(input: FolderMemberRepositoryDeleteInput): Promise<void> {
    await this.prismaManager.getClient().folderMember.deleteMany({
      where: input.where,
    });
  }
}

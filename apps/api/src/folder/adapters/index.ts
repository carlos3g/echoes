import { Folder } from '@app/folder/entities/folder.entity';
import { FolderMember } from '@app/folder/entities/folder-member.entity';
import { FolderInviteLink } from '@app/folder/entities/folder-invite-link.entity';
import type {
  Folder as PrismaFolder,
  FolderMember as PrismaFolderMember,
  FolderInviteLink as PrismaFolderInviteLink,
  User as PrismaUser,
} from '@generated/prisma/client';

export const prismaFolderToFolderAdapter = (input: PrismaFolder & { user?: PrismaUser | null }) =>
  new Folder({
    ...input,
    id: Number(input.id),
    userId: Number(input.userId),
    owner: input.user
      ? {
          uuid: input.user.uuid,
          name: input.user.name,
          username: input.user.username,
        }
      : undefined,
  });

export const prismaFolderMemberToFolderMemberAdapter = (input: PrismaFolderMember) =>
  new FolderMember({
    ...input,
    id: Number(input.id),
    folderId: Number(input.folderId),
    userId: Number(input.userId),
  });

export const prismaFolderInviteLinkToFolderInviteLinkAdapter = (input: PrismaFolderInviteLink) =>
  new FolderInviteLink({
    ...input,
    id: Number(input.id),
    folderId: Number(input.folderId),
    createdById: Number(input.createdById),
  });

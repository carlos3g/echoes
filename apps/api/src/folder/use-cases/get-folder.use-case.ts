import type { UseCaseHandler } from '@app/shared/interfaces';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import type { GetFolderInput } from '@app/folder/dtos/get-folder-input';
import { Folder } from '@app/folder/entities/folder.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetFolderUseCase implements UseCaseHandler {
  public constructor(
    private readonly folderRepository: FolderRepositoryContract,
    private readonly folderMemberRepository: FolderMemberRepositoryContract,
    private readonly folderAuthorization: FolderAuthorizationService
  ) {}

  public async handle(input: GetFolderInput): Promise<Folder> {
    const { uuid, user } = input;

    const folder = await this.folderRepository.findUniqueOrThrow({ where: { uuid } });

    await this.folderAuthorization.assertCanViewFolder(user?.id, folder);

    const [totalQuotes, totalFollowers, member] = await Promise.all([
      this.folderRepository.countQuotes({ folderId: folder.id }),
      this.folderRepository.countFollowers({ folderId: folder.id }),
      user ? this.folderMemberRepository.find({ where: { folderId: folder.id, userId: user.id } }) : null,
    ]);

    return new Folder({
      ...folder,
      metadata: {
        totalQuotes,
        totalFollowers,
        memberRole: member?.role ?? null,
      },
    });
  }
}

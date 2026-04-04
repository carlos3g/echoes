import type { UseCaseHandler } from '@app/shared/interfaces';
import type { CreateFolderInput } from '@app/folder/dtos/create-folder-input';
import type { Folder } from '@app/folder/entities/folder.entity';
import { FolderService } from '@app/folder/services/folder.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateFolderUseCase implements UseCaseHandler {
  public constructor(private readonly folderService: FolderService) {}

  public async handle(input: CreateFolderInput): Promise<Folder> {
    const { user, ...rest } = input;

    return this.folderService.create({
      ...rest,
      userId: user.id,
    });
  }
}

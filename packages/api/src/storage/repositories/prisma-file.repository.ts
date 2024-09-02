import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaFileToFileAdapter } from '@app/storage/adapters';
import type { FileRepositoryContract } from '@app/storage/contracts/file-repository.contract';
import type {
  FileRepositoryCreateInput,
  FileRepositoryDeleteInput,
  FileRepositoryFindUniqueOrThrowInput,
} from '@app/storage/dtos/file-repository-dtos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaFileRepository implements FileRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async create(input: FileRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().file.create({
      data: input,
    });

    return prismaFileToFileAdapter(entity);
  }

  public async findUniqueOrThrow(input: FileRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().file.findUniqueOrThrow({
      where: input.where,
    });

    return prismaFileToFileAdapter(entity);
  }

  public async delete(input: FileRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().file.delete({ where });
  }
}

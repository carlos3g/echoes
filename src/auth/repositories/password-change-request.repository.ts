import type { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts';
import type {
  BatchOutput,
  PasswordChangeRequestRepositoryCreateInput,
  PasswordChangeRequestRepositoryDeleteManyInput,
  PasswordChangeRequestRepositoryFindFirstOrThrowInput,
  PasswordChangeRequestRepositoryFindUniqueOrThrowInput,
} from '@app/auth/dtos/password-change-request-repository-dtos';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordChangeRequestRepository implements PasswordChangeRequestRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: PasswordChangeRequestRepositoryFindUniqueOrThrowInput) {
    return this.prismaManager.getClient().passwordChangeRequest.findUniqueOrThrow({
      where: input.where,
    });
  }

  public async findFirstOrThrow(input: PasswordChangeRequestRepositoryFindFirstOrThrowInput) {
    return this.prismaManager.getClient().passwordChangeRequest.findFirstOrThrow({
      where: input.where,
    });
  }

  public async create(input: PasswordChangeRequestRepositoryCreateInput) {
    return this.prismaManager.getClient().passwordChangeRequest.create({
      data: {
        ...input,
      },
    });
  }

  public deleteMany(input: PasswordChangeRequestRepositoryDeleteManyInput): Promise<BatchOutput> {
    return this.prismaManager.getClient().passwordChangeRequest.deleteMany({ where: input.where });
  }
}

import { prismaPasswordChangeRequestToPasswordChangeRequestAdapter } from '@app/auth/adapters';
import type { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type {
  PasswordChangeRequestRepositoryCreateInput,
  PasswordChangeRequestRepositoryDeleteManyInput,
  PasswordChangeRequestRepositoryFindFirstOrThrowInput,
  PasswordChangeRequestRepositoryFindUniqueOrThrowInput,
} from '@app/auth/dtos/password-change-request-repository-dtos';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPasswordChangeRequestRepository implements PasswordChangeRequestRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: PasswordChangeRequestRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().passwordChangeRequest.findUniqueOrThrow({
      where: input.where,
    });

    return prismaPasswordChangeRequestToPasswordChangeRequestAdapter(entity);
  }

  public async findFirstOrThrow(input: PasswordChangeRequestRepositoryFindFirstOrThrowInput) {
    const entity = await this.prismaManager.getClient().passwordChangeRequest.findFirstOrThrow({
      where: input.where,
    });

    return prismaPasswordChangeRequestToPasswordChangeRequestAdapter(entity);
  }

  public async create(input: PasswordChangeRequestRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().passwordChangeRequest.create({
      data: {
        ...input,
      },
    });

    return prismaPasswordChangeRequestToPasswordChangeRequestAdapter(entity);
  }

  public deleteMany(input: PasswordChangeRequestRepositoryDeleteManyInput) {
    return this.prismaManager.getClient().passwordChangeRequest.deleteMany({ where: input.where });
  }
}

import { prismaPasswordChangeRequestToPasswordChangeRequestAdapter } from '@app/auth/adapters';
import type { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type {
  PasswordChangeRequestRepositoryCreateInput,
  PasswordChangeRequestRepositoryDeleteManyInput,
  PasswordChangeRequestRepositoryFindFirstOrThrowInput,
  PasswordChangeRequestRepositoryFindFirstValidOrThrowInput,
  PasswordChangeRequestRepositoryFindUniqueOrThrowInput,
  PasswordChangeRequestRepositoryUpdateInput,
} from '@app/auth/dtos/password-change-request-repository-dtos';
import type { PasswordChangeRequest } from '@app/auth/entities/password-change-request.entity';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import type { BatchOutput } from '@app/lib/prisma/types';
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

  public async findFirstValidOrThrow(
    input: PasswordChangeRequestRepositoryFindFirstValidOrThrowInput
  ): Promise<PasswordChangeRequest> {
    const entity = await this.prismaManager.getClient().passwordChangeRequest.findFirstOrThrow({
      where: {
        ...input.where,
        usedAt: null,
      },
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

  public async update(input: PasswordChangeRequestRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().passwordChangeRequest.update({
      where: input.where,
      data: input.data,
    });

    return prismaPasswordChangeRequestToPasswordChangeRequestAdapter(entity);
  }

  public deleteMany(input: PasswordChangeRequestRepositoryDeleteManyInput) {
    return this.prismaManager.getClient().passwordChangeRequest.deleteMany({ where: input.where });
  }

  public deleteUsed(): Promise<BatchOutput> {
    return this.prismaManager.getClient().passwordChangeRequest.deleteMany({
      where: {
        usedAt: { not: null },
      },
    });
  }
}

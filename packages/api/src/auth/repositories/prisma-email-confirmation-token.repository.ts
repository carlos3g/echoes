import { prismaEmailConfirmationTokenToEmailConfirmationTokenAdapter } from '@app/auth/adapters';
import type { EmailConfirmationTokenRepositoryContract } from '@app/auth/contracts/email-confirmation-token-repository.contract';
import type {
  EmailConfirmationTokenRepositoryCreateInput,
  EmailConfirmationTokenRepositoryDeleteManyInput,
  EmailConfirmationTokenRepositoryFindFirstValidOrThrowInput,
  EmailConfirmationTokenRepositoryFindUniqueOrThrowInput,
  EmailConfirmationTokenRepositoryUpdateInput,
} from '@app/auth/dtos/email-confirmation-token-repository-dtos';
import type { EmailConfirmationToken } from '@app/auth/entities/email-confirmation-token.entity';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import type { BatchOutput } from '@app/lib/prisma/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaEmailConfirmationTokenRepository implements EmailConfirmationTokenRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: EmailConfirmationTokenRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().emailConfirmationToken.findUniqueOrThrow({
      where: input.where,
    });

    return prismaEmailConfirmationTokenToEmailConfirmationTokenAdapter(entity);
  }

  public async findFirstValidOrThrow(
    input: EmailConfirmationTokenRepositoryFindFirstValidOrThrowInput
  ): Promise<EmailConfirmationToken> {
    const entity = await this.prismaManager.getClient().emailConfirmationToken.findFirstOrThrow({
      where: {
        ...input.where,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    return prismaEmailConfirmationTokenToEmailConfirmationTokenAdapter(entity);
  }

  public async create(input: EmailConfirmationTokenRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().emailConfirmationToken.create({
      data: {
        ...input,
      },
    });

    return prismaEmailConfirmationTokenToEmailConfirmationTokenAdapter(entity);
  }

  public async update(input: EmailConfirmationTokenRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().emailConfirmationToken.update({
      where: input.where,
      data: input.data,
    });

    return prismaEmailConfirmationTokenToEmailConfirmationTokenAdapter(entity);
  }

  public deleteMany(input: EmailConfirmationTokenRepositoryDeleteManyInput) {
    return this.prismaManager.getClient().emailConfirmationToken.deleteMany({ where: input.where });
  }

  public deleteUsed(): Promise<BatchOutput> {
    return this.prismaManager.getClient().emailConfirmationToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }],
      },
    });
  }
}

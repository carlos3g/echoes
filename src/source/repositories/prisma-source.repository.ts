import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { createPaginator } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaSourceToSourceAdapter } from '@app/source/adapters';
import type { SourceRepositoryContract } from '@app/source/contracts/source-repository.contract';
import type {
  SourceRepositoryCreateInput,
  SourceRepositoryFindManyInput,
  SourceRepositoryFindManyPaginatedInput,
  SourceRepositoryFindUniqueOrThrowInput,
  SourceRepositoryUpdateInput,
} from '@app/source/dtos/source-repository-dtos';
import type { Source } from '@app/source/entities/source.entity';
import { Injectable } from '@nestjs/common';
import type { Prisma, Source as PrismaSource } from '@prisma/client';

type FindManyReturn = PrismaSource;

@Injectable()
export class PrismaSourceRepository implements SourceRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: SourceRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().source.findUniqueOrThrow({
      where: input.where,
    });

    return prismaSourceToSourceAdapter(entity);
  }

  public async findManyPaginated(input: SourceRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Source>> {
    const { ...where } = input.where || {};
    const { perPage, page } = input.options;

    const paginate = createPaginator({ perPage });

    const result = await paginate<FindManyReturn, Prisma.SourceFindManyArgs>(
      this.prismaManager.getClient().source,
      {
        where: {
          ...where,
        },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page }
    );

    return {
      ...result,
      data: result.data.map(prismaSourceToSourceAdapter),
    };
  }

  public async findMany(input?: SourceRepositoryFindManyInput): Promise<Source[]> {
    const { ...where } = input?.where || {};

    const entities = await this.prismaManager.getClient().source.findMany({
      where: {
        ...where,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaSourceToSourceAdapter);
  }

  public async create(input: SourceRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().source.create({
      data: input,
    });

    return prismaSourceToSourceAdapter(entity);
  }

  public async update(input: SourceRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().source.update({
      where: input.where,
      data: input.data,
    });

    return prismaSourceToSourceAdapter(entity);
  }
}

import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { createPaginator } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { prismaTagToTagAdapter } from '@app/tag/adapters';
import type { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type {
  TagRepositoryCreateInput,
  TagRepositoryDeleteInput,
  TagRepositoryFindManyInput,
  TagRepositoryFindManyPaginatedInput,
  TagRepositoryFindUniqueOrThrowInput,
  TagRepositoryUpdateInput,
} from '@app/tag/dtos/tag-repository-dtos';
import type { Tag } from '@app/tag/entities/tag.entity';
import { Injectable } from '@nestjs/common';
import type { Prisma, Tag as PrismaTag } from '@prisma/client';

type FindManyReturn = PrismaTag;

@Injectable()
export class PrismaTagRepository implements TagRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: TagRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().tag.findUniqueOrThrow({
      where: input.where,
    });

    return prismaTagToTagAdapter(entity);
  }

  public async findManyPaginated(input: TagRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Tag>> {
    const { ...where } = input.where || {};
    const { perPage, page } = input.options;

    const paginate = createPaginator({ perPage });

    const result = await paginate<FindManyReturn, Prisma.TagFindManyArgs>(
      this.prismaManager.getClient().tag,
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
      data: result.data.map(prismaTagToTagAdapter),
    };
  }

  public async findMany(input?: TagRepositoryFindManyInput): Promise<Tag[]> {
    const { ...where } = input?.where || {};

    const entities = await this.prismaManager.getClient().tag.findMany({
      where: {
        ...where,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaTagToTagAdapter);
  }

  public async create(input: TagRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().tag.create({
      data: input,
    });

    return prismaTagToTagAdapter(entity);
  }

  public async update(input: TagRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().tag.update({
      where: input.where,
      data: input.data,
    });

    return prismaTagToTagAdapter(entity);
  }

  public async delete(input: TagRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().tag.delete({ where });
  }
}

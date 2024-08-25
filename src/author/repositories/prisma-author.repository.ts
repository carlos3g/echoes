import { prismaAuthorToAuthorAdapter } from '@app/author/adapters';
import type { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type {
  AuthorRepositoryCreateInput,
  AuthorRepositoryDeleteInput,
  AuthorRepositoryFindManyInput,
  AuthorRepositoryFindManyPaginatedInput,
  AuthorRepositoryFindUniqueOrThrowInput,
  AuthorRepositoryUpdateInput,
} from '@app/author/dtos/author-repository-dtos';
import type { Author } from '@app/author/entities/author.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { createPaginator } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';
import type { Prisma, Author as PrismaAuthor } from '@prisma/client';

type FindManyReturn = PrismaAuthor;

@Injectable()
export class PrismaAuthorRepository implements AuthorRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: AuthorRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().author.findUniqueOrThrow({
      where: input.where,
    });

    return prismaAuthorToAuthorAdapter(entity);
  }

  public async findManyPaginated(input: AuthorRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Author>> {
    const { ...where } = input.where || {};
    const { perPage = 20, page = 1 } = input.options || {};

    const paginate = createPaginator({ perPage });

    const result = await paginate<FindManyReturn, Prisma.AuthorFindManyArgs>(
      this.prismaManager.getClient().author,
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
      data: result.data.map(prismaAuthorToAuthorAdapter),
    };
  }

  public async findMany(input?: AuthorRepositoryFindManyInput): Promise<Author[]> {
    const { ...where } = input?.where || {};

    const entities = await this.prismaManager.getClient().author.findMany({
      where: {
        ...where,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaAuthorToAuthorAdapter);
  }

  public async create(input: AuthorRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().author.create({
      data: input,
    });

    return prismaAuthorToAuthorAdapter(entity);
  }

  public async update(input: AuthorRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().author.update({
      where: input.where,
      data: input.data,
    });

    return prismaAuthorToAuthorAdapter(entity);
  }

  public async delete(input: AuthorRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().author.delete({ where });
  }
}

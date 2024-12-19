import { prismaAuthorToAuthorAdapter } from '@app/author/adapters';
import type { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type {
  AuthorRepositoryCreateInput,
  AuthorRepositoryDeleteInput,
  AuthorRepositoryFavoriteInput,
  AuthorRepositoryFindManyByTagInput,
  AuthorRepositoryFindManyFavoritedByUserInput,
  AuthorRepositoryFindManyInput,
  AuthorRepositoryFindManyPaginatedInput,
  AuthorRepositoryFindUniqueOrThrowInput,
  AuthorRepositoryTagInput,
  AuthorRepositoryUntagInput,
  AuthorRepositoryUpdateInput,
} from '@app/author/dtos/author-repository-dtos';
import type { Author } from '@app/author/entities/author.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { paginate } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';
import type { Author as PrismaAuthor } from '@prisma/client';

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

    const result = await paginate<FindManyReturn, 'Author'>(
      this.prismaManager.getClient().author,
      {
        where: {
          ...where,
        },
        orderBy: [{ createdAt: 'desc' }],
      },
      { page, perPage }
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

  public async findManyFavoritedByUser(input: AuthorRepositoryFindManyFavoritedByUserInput): Promise<Author[]> {
    const entities = await this.prismaManager.getClient().author.findMany({
      where: {
        favoritedBy: {
          some: {
            userId: input.where.userId,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaAuthorToAuthorAdapter);
  }

  public async findManyByTag(input: AuthorRepositoryFindManyByTagInput): Promise<Author[]> {
    const entities = await this.prismaManager.getClient().author.findMany({
      where: {
        tags: {
          some: {
            tagId: input.where.tagId,
          },
        },
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

  public async favorite(input: AuthorRepositoryFavoriteInput): Promise<void> {
    await this.prismaManager.getClient().userFavoriteAuthor.create({ data: input.data });
  }

  public async tag(input: AuthorRepositoryTagInput): Promise<void> {
    await this.prismaManager.getClient().tagAuthor.create({ data: input.data });
  }

  public async untag(input: AuthorRepositoryUntagInput): Promise<void> {
    await this.prismaManager.getClient().tagAuthor.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        tagId_authorId: input.data,
      },
    });
  }

  public async delete(input: AuthorRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().author.delete({ where });
  }
}

// fix

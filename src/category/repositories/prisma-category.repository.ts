import { prismaCategoryToCategoryAdapter } from '@app/category/adapters';
import type { CategoryRepositoryContract } from '@app/category/contracts/category-repository.contract';
import type {
  CategoryRepositoryCreateInput,
  CategoryRepositoryDeleteInput,
  CategoryRepositoryFindManyInput,
  CategoryRepositoryFindManyPaginatedInput,
  CategoryRepositoryFindUniqueOrThrowInput,
  CategoryRepositoryUpdateInput,
} from '@app/category/dtos/category-repository-dtos';
import type { Category } from '@app/category/entities/category.entity';
import { paginate, type PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';
import type { Category as PrismaCategory } from '@prisma/client';

type FindManyReturn = PrismaCategory;

@Injectable()
export class PrismaCategoryRepository implements CategoryRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async findUniqueOrThrow(input: CategoryRepositoryFindUniqueOrThrowInput) {
    const entity = await this.prismaManager.getClient().category.findUniqueOrThrow({
      where: input.where,
    });

    return prismaCategoryToCategoryAdapter(entity);
  }

  public async findManyPaginated(input: CategoryRepositoryFindManyPaginatedInput): Promise<PaginatedResult<Category>> {
    const { ...where } = input.where || {};
    const { perPage = 20, page = 1 } = input.options || {};

    const result = await paginate<FindManyReturn, 'Category'>(
      this.prismaManager.getClient().category,
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
      data: result.data.map(prismaCategoryToCategoryAdapter),
    };
  }

  public async findMany(input?: CategoryRepositoryFindManyInput): Promise<Category[]> {
    const { ...where } = input?.where || {};

    const entities = await this.prismaManager.getClient().category.findMany({
      where: {
        ...where,
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return entities.map(prismaCategoryToCategoryAdapter);
  }

  public async create(input: CategoryRepositoryCreateInput) {
    const entity = await this.prismaManager.getClient().category.create({
      data: input,
    });

    return prismaCategoryToCategoryAdapter(entity);
  }

  public async update(input: CategoryRepositoryUpdateInput) {
    const entity = await this.prismaManager.getClient().category.update({
      where: input.where,
      data: input.data,
    });

    return prismaCategoryToCategoryAdapter(entity);
  }

  public async delete(input: CategoryRepositoryDeleteInput): Promise<void> {
    const { where } = input;

    await this.prismaManager.getClient().category.delete({ where });
  }
}

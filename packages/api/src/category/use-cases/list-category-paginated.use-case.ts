import { CategoryRepositoryContract } from '@app/category/contracts/category-repository.contract';
import type { CategoryPaginatedInput } from '@app/category/dtos/category-paginated-input';
import type { Category } from '@app/category/entities/category.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListCategoryPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly categoryRepository: CategoryRepositoryContract) {}

  public async handle(input: CategoryPaginatedInput): Promise<PaginatedResult<Category>> {
    const { filters, paginate } = input;

    const result = await this.categoryRepository.findManyPaginated({
      where: filters,
      options: paginate,
    });

    return result;
  }
}

import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import type { AuthorPaginatedInput } from '@app/author/dtos/author-paginated-input';
import type { Author } from '@app/author/entities/author.entity';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListAuthorPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly authorRepository: AuthorRepositoryContract) {}

  public async handle(input: AuthorPaginatedInput): Promise<PaginatedResult<Author>> {
    const { filters, paginate } = input;

    const result = await this.authorRepository.findManyPaginated({
      where: filters,
      options: paginate,
    });

    return result;
  }
}

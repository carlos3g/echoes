import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type { TagPaginatedInput } from '@app/tag/dtos/tag-paginated-input';
import type { Tag } from '@app/tag/entities/tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ListTagPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly tagRepository: TagRepositoryContract) {}

  public async handle(input: TagPaginatedInput): Promise<PaginatedResult<Tag>> {
    const { filters, paginate, user } = input;

    const result = await this.tagRepository.findManyPaginated({
      where: { ...filters, userId: user.id },
      options: paginate,
    });

    return result;
  }
}

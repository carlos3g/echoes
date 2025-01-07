import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import type { TagPaginatedInput } from '@app/tag/dtos/tag-paginated-input';
import type { Tag } from '@app/tag/entities/tag.entity';
import { Injectable } from '@nestjs/common';

type TagWithMetadata = Tag & {
  metadata: {
    totalQuotes: number;
  };
};

@Injectable()
export class ListTagPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly tagRepository: TagRepositoryContract) {}

  public async handle(input: TagPaginatedInput): Promise<PaginatedResult<TagWithMetadata>> {
    const { filters, paginate, user } = input;

    const result = await this.tagRepository.findManyPaginated({
      where: { ...filters, userId: user.id },
      options: paginate,
    });

    return {
      ...result,
      data: await this.enrichWithMetadata(result.data),
    };
  }

  public async enrichWithMetadata(tags: Tag[]): Promise<TagWithMetadata[]> {
    const tagsWithMetadataPromises = tags.map(async (tag) => {
      const [totalQuotes] = await Promise.all([this.tagRepository.countQuotes(tag.id)]);

      return { ...tag, metadata: { totalQuotes } };
    });

    return Promise.all(tagsWithMetadataPromises);
  }
}

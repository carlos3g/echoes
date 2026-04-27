import { Injectable } from '@nestjs/common';
import { SearchRepositoryContract } from '@app/search/contracts/search-repository.contract';
import type { SearchQueryDto } from '@app/search/dtos/search-query.dto';
import type { SearchResultDto } from '@app/search/dtos/search-result.dto';
import type { User } from '@app/user/entities/user.entity';

@Injectable()
export class SearchUseCase {
  public constructor(private readonly searchRepo: SearchRepositoryContract) {}

  public async execute(query: SearchQueryDto, user?: User): Promise<SearchResultDto> {
    const { q, quotesLimit = 20, authorsLimit = 5, categoriesLimit = 5 } = query;
    const userId = user ? BigInt(user.id) : undefined;

    const [quotes, authors, categories] = await Promise.all([
      this.searchRepo
        .searchQuotes(q, quotesLimit, userId)
        .then((results) =>
          results.length === 0 ? this.searchRepo.fuzzySearchQuotes(q, quotesLimit, userId) : results
        ),
      this.searchRepo
        .searchAuthors(q, authorsLimit)
        .then((results) => (results.length === 0 ? this.searchRepo.fuzzySearchAuthors(q, authorsLimit) : results)),
      this.searchRepo.searchCategories(q, categoriesLimit),
    ]);

    return { quotes, authors, categories };
  }
}

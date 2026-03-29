import { AuthorModule } from '@app/author/author.module';
import { CategoryModule } from '@app/category/category.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { QuoteController } from '@app/quote/quote.controller';
import { PrismaQuoteRepository } from '@app/quote/repositories/prisma-quote.repository';
import { FavoriteQuoteUseCase } from '@app/quote/use-cases/favorite-quote.use-case';
import { GetOneQuoteUseCase } from '@app/quote/use-cases/get-one-quote.use-case';
import { IsQuoteTaggedUseCase } from '@app/quote/use-cases/is-quote-tagged.use-case';
import { ListQuotePaginatedUseCase } from '@app/quote/use-cases/list-quote-paginated.use-case';
import { TagQuoteUseCase } from '@app/quote/use-cases/tag-quote.use-case';
import { UnfavoriteQuoteUseCase } from '@app/quote/use-cases/unfavorite-quote.use-case';
import { ShareQuoteUseCase } from '@app/quote/use-cases/share-quote.use-case';
import { UntagQuoteUseCase } from '@app/quote/use-cases/untag-quote.use-case';
import { TagModule } from '@app/tag/tag.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthorModule, TagModule, CategoryModule],
  controllers: [QuoteController],
  providers: [
    {
      provide: QuoteRepositoryContract,
      useClass: PrismaQuoteRepository,
    },
    ListQuotePaginatedUseCase,
    GetOneQuoteUseCase,
    FavoriteQuoteUseCase,
    TagQuoteUseCase,
    UntagQuoteUseCase,
    IsQuoteTaggedUseCase,
    UnfavoriteQuoteUseCase,
    ShareQuoteUseCase,
  ],
  exports: [QuoteRepositoryContract],
})
export class QuoteModule {}

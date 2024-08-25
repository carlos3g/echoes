import { AuthorModule } from '@app/author/author.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { QuoteController } from '@app/quote/quote.controller';
import { PrismaQuoteRepository } from '@app/quote/repositories/prisma-quote.repository';
import { QuoteService } from '@app/quote/services/quote.service';
import { GetOneQuoteUseCase } from '@app/quote/use-cases/get-one-quote.use-case';
import { ListQuotePaginatedUseCase } from '@app/quote/use-cases/list-quote-paginated.use-case';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthorModule],
  controllers: [QuoteController],
  providers: [
    {
      provide: QuoteRepositoryContract,
      useClass: PrismaQuoteRepository,
    },
    QuoteService,
    ListQuotePaginatedUseCase,
    GetOneQuoteUseCase,
  ],
  exports: [QuoteRepositoryContract],
})
export class QuoteModule {}

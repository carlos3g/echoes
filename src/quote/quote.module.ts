import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { QuoteController } from '@app/quote/quote.controller';
import { PrismaQuoteRepository } from '@app/quote/repositories/prisma-quote.repository';
import { QuoteService } from '@app/quote/services/quote.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [QuoteController],
  providers: [
    QuoteService,
    {
      provide: QuoteRepositoryContract,
      useClass: PrismaQuoteRepository,
    },
  ],
  exports: [QuoteRepositoryContract],
})
export class QuoteModule {}

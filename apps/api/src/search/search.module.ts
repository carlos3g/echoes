import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { SearchController } from '@app/search/search.controller';
import { SearchUseCase } from '@app/search/use-cases/search.use-case';
import { SearchRepositoryContract } from '@app/search/contracts/search-repository.contract';
import { PrismaSearchRepository } from '@app/search/repositories/prisma-search.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [
    SearchUseCase,
    {
      provide: SearchRepositoryContract,
      useClass: PrismaSearchRepository,
    },
  ],
})
export class SearchModule {}

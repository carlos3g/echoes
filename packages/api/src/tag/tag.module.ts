import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { PrismaTagRepository } from '@app/tag/repositories/prisma-tag.repository';
import { TagService } from '@app/tag/services/tag.service';
import { TagController } from '@app/tag/tag.controller';
import { CreateTagUseCase } from '@app/tag/use-cases/create-tag.use-case';
import { ListTagPaginatedUseCase } from '@app/tag/use-cases/list-tag-paginated.use-case';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [
    {
      provide: TagRepositoryContract,
      useClass: PrismaTagRepository,
    },
    TagService,
    ListTagPaginatedUseCase,
    CreateTagUseCase,
  ],
  exports: [TagRepositoryContract],
})
export class TagModule {}

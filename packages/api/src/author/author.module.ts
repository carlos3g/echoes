import { AuthorController } from '@app/author/author.controller';
import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { PrismaAuthorRepository } from '@app/author/repositories/prisma-author.repository';
import { AuthorService } from '@app/author/services/author.service';
import { FavoriteAuthorUseCase } from '@app/author/use-cases/favorite-author.use-case';
import { GetOneAuthorUseCase } from '@app/author/use-cases/get-one-author.use-case';
import { ListAuthorPaginatedUseCase } from '@app/author/use-cases/list-author-paginated.use-case';
import { TagAuthorUseCase } from '@app/author/use-cases/tag-author.use-case';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { TagModule } from '@app/tag/tag.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, TagModule],
  controllers: [AuthorController],
  providers: [
    {
      provide: AuthorRepositoryContract,
      useClass: PrismaAuthorRepository,
    },
    AuthorService,
    ListAuthorPaginatedUseCase,
    GetOneAuthorUseCase,
    FavoriteAuthorUseCase,
    TagAuthorUseCase,
  ],
  exports: [AuthorRepositoryContract],
})
export class AuthorModule {}

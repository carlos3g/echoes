import { AuthorController } from '@app/author/author.controller';
import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { PrismaAuthorRepository } from '@app/author/repositories/prisma-author.repository';
import { AuthorService } from '@app/author/services/author.service';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [AuthorController],
  providers: [
    AuthorService,
    {
      provide: AuthorRepositoryContract,
      useClass: PrismaAuthorRepository,
    },
  ],
  exports: [AuthorRepositoryContract],
})
export class AuthorModule {}

import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { TagRepositoryContract } from '@app/tag/contracts/tag-repository.contract';
import { PrismaTagRepository } from '@app/tag/repositories/prisma-tag.repository';
import { TagService } from '@app/tag/services/tag.service';
import { TagController } from '@app/tag/tag.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TagController],
  providers: [
    TagService,
    {
      provide: TagRepositoryContract,
      useClass: PrismaTagRepository,
    },
  ],
  exports: [
    {
      provide: TagRepositoryContract,
      useClass: PrismaTagRepository,
    },
  ],
})
export class TagModule {}

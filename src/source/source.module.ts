import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { SourceRepositoryContract } from '@app/source/contracts/source-repository.contract';
import { PrismaSourceRepository } from '@app/source/repositories/prisma-source.repository';
import { SourceService } from '@app/source/services/source.service';
import { SourceController } from '@app/source/source.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [SourceController],
  providers: [
    SourceService,
    {
      provide: SourceRepositoryContract,
      useClass: PrismaSourceRepository,
    },
  ],
  exports: [
    {
      provide: SourceRepositoryContract,
      useClass: PrismaSourceRepository,
    },
  ],
})
export class SourceModule {}

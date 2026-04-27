import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { FileRepositoryContract } from '@app/storage/contracts/file-repository.contract';
import { StorageServiceContract } from '@app/storage/contracts/storage-service.contract';
import { PrismaFileRepository } from '@app/storage/repositories/prisma-file.repository';
import { S3StorageService } from '@app/storage/services/s3-storage.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: StorageServiceContract,
      useClass: S3StorageService,
    },
    {
      provide: FileRepositoryContract,
      useClass: PrismaFileRepository,
    },
  ],
  exports: [StorageServiceContract, FileRepositoryContract],
})
export class StorageModule {}

import { CategoryController } from '@app/category/category.controller';
import { CategoryRepositoryContract } from '@app/category/contracts/category-repository.contract';
import { PrismaCategoryRepository } from '@app/category/repositories/prisma-category.repository';
import { CategoryService } from '@app/category/services/category.service';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepositoryContract,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [
    {
      provide: CategoryRepositoryContract,
      useClass: PrismaCategoryRepository,
    },
  ],
})
export class CategoryModule {}

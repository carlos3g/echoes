import { CategoryController } from '@app/category/category.controller';
import { CategoryRepositoryContract } from '@app/category/contracts/category-repository.contract';
import { PrismaCategoryRepository } from '@app/category/repositories/prisma-category.repository';
import { CategoryService } from '@app/category/services/category.service';
import { ListCategoryPaginatedUseCase } from '@app/category/use-cases/list-category-paginated.use-case';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: CategoryRepositoryContract,
      useClass: PrismaCategoryRepository,
    },
    CategoryService,
    ListCategoryPaginatedUseCase,
  ],
  exports: [CategoryRepositoryContract],
})
export class CategoryModule {}

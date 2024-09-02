import { Public } from '@app/auth/decorators/public.decorator';
import { CategoryPaginatedQuery } from '@app/category/dtos/category-paginated-query';
import { ListCategoryPaginatedUseCase } from '@app/category/use-cases/list-category-paginated.use-case';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Public()
@Controller('categories')
export class CategoryController {
  public constructor(private readonly listCategoryPaginatedUseCase: ListCategoryPaginatedUseCase) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: CategoryPaginatedQuery) {
    return this.listCategoryPaginatedUseCase.handle(params);
  }
}

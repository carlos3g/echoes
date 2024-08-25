import { Public } from '@app/auth/decorators/public.decorator';
import { AuthorPaginatedQuery } from '@app/author/dtos/author-paginated-query';
import { GetOneAuthorUseCase } from '@app/author/use-cases/get-one-author.use-case';
import { ListAuthorPaginatedUseCase } from '@app/author/use-cases/list-author-paginated.use-case';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';

@Public()
@Controller('authors')
export class AuthorController {
  public constructor(
    private readonly listAuthorPaginatedUseCase: ListAuthorPaginatedUseCase,
    private readonly getOneAuthorUseCase: GetOneAuthorUseCase
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: AuthorPaginatedQuery) {
    return this.listAuthorPaginatedUseCase.handle(params);
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('uuid') uuid: string) {
    return this.getOneAuthorUseCase.handle({ uuid });
  }
}

import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { TagPaginatedQuery } from '@app/tag/dtos/tag-paginated-query';
import { ListTagPaginatedUseCase } from '@app/tag/use-cases/list-tag-paginated.use-case';
import { User } from '@app/user/entities/user.entity';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tags')
export class TagController {
  public constructor(private readonly listTagPaginatedUseCase: ListTagPaginatedUseCase) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: TagPaginatedQuery, @UserDecorator() user: User) {
    return this.listTagPaginatedUseCase.handle({ ...params, user });
  }
}

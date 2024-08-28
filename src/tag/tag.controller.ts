import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { CreateTagRequest } from '@app/tag/dtos/create-tag-request';
import { TagPaginatedQuery } from '@app/tag/dtos/tag-paginated-query';
import { CreateTagUseCase } from '@app/tag/use-cases/create-tag.use-case';
import { ListTagPaginatedUseCase } from '@app/tag/use-cases/list-tag-paginated.use-case';
import { User } from '@app/user/entities/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('tags')
export class TagController {
  public constructor(
    private readonly listTagPaginatedUseCase: ListTagPaginatedUseCase,
    private readonly createTagUseCase: CreateTagUseCase
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: TagPaginatedQuery, @UserDecorator() user: User) {
    return this.listTagPaginatedUseCase.handle({ ...params, user });
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@UserDecorator() user: User, @Body() input: CreateTagRequest) {
    return this.createTagUseCase.handle({ user, ...input });
  }
}

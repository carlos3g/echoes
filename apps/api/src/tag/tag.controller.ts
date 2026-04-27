import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { CreateTagRequest } from '@app/tag/dtos/create-tag-request';
import { TagPaginatedQuery } from '@app/tag/dtos/tag-paginated-query';
import { UpdateTagRequest } from '@app/tag/dtos/update-tag-request';
import { CreateTagUseCase } from '@app/tag/use-cases/create-tag.use-case';
import { ListTagPaginatedUseCase } from '@app/tag/use-cases/list-tag-paginated.use-case';
import { DeleteTagUseCase } from '@app/tag/use-cases/delete-tag.use-case';
import { UpdateTagUseCase } from '@app/tag/use-cases/update-tag.use-case';
import { User } from '@app/user/entities/user.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({ path: 'tags', version: '1' })
export class TagController {
  public constructor(
    private readonly listTagPaginatedUseCase: ListTagPaginatedUseCase,
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase
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

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: UpdateTagRequest) {
    return this.updateTagUseCase.handle({ uuid, user, ...input });
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.deleteTagUseCase.handle({ uuid, user });
  }
}

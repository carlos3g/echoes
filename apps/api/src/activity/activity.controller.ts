import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { ListActivityPaginatedQuery } from '@app/activity/dtos/list-activity-paginated.dto';
import { ListActivityPaginatedUseCase } from '@app/activity/use-cases/list-activity-paginated.use-case';
import type { User } from '@app/user/entities/user.entity';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({ path: 'activity', version: '1' })
export class ActivityController {
  public constructor(private readonly listActivityPaginatedUseCase: ListActivityPaginatedUseCase) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: ListActivityPaginatedQuery, @UserDecorator() user: User) {
    return this.listActivityPaginatedUseCase.handle({
      page: params.paginate?.page ?? 1,
      perPage: params.paginate?.perPage ?? 20,
      user,
    });
  }
}

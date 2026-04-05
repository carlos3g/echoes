import { AnalyticsTimeRangeQuery } from '@app/admin/dtos/analytics-query.dto';
import { AdminListUsersQuery } from '@app/admin/dtos/list-users-query.dto';
import { AdminGuard } from '@app/admin/guards/admin.guard';
import { GetAnalyticsOverviewUseCase } from '@app/admin/use-cases/get-analytics-overview.use-case';
import { GetQuoteActivityUseCase } from '@app/admin/use-cases/get-quote-activity.use-case';
import { GetUserGrowthUseCase } from '@app/admin/use-cases/get-user-growth.use-case';
import { AdminListUsersPaginatedUseCase } from '@app/admin/use-cases/list-users-paginated.use-case';
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  public constructor(
    private readonly getAnalyticsOverviewUseCase: GetAnalyticsOverviewUseCase,
    private readonly getUserGrowthUseCase: GetUserGrowthUseCase,
    private readonly getQuoteActivityUseCase: GetQuoteActivityUseCase,
    private readonly listUsersPaginatedUseCase: AdminListUsersPaginatedUseCase
  ) {}

  @Get('analytics/overview')
  @HttpCode(HttpStatus.OK)
  public async overview() {
    return this.getAnalyticsOverviewUseCase.handle();
  }

  @Get('analytics/user-growth')
  @HttpCode(HttpStatus.OK)
  public async userGrowth(@Query() query: AnalyticsTimeRangeQuery) {
    return this.getUserGrowthUseCase.handle({ days: query.days });
  }

  @Get('analytics/quote-activity')
  @HttpCode(HttpStatus.OK)
  public async quoteActivity(@Query() query: AnalyticsTimeRangeQuery) {
    return this.getQuoteActivityUseCase.handle({ days: query.days });
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  public async listUsers(@Query() params: AdminListUsersQuery) {
    return this.listUsersPaginatedUseCase.handle({
      search: params.search,
      page: params.page,
      perPage: params.perPage,
    });
  }
}

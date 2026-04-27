import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { CompareMonthsQuery } from '@app/insight/dtos/compare-months.dto';
import { GetAnnualInsightsQuery } from '@app/insight/dtos/get-annual-insights.dto';
import { GetInsightsQuery } from '@app/insight/dtos/get-insights.dto';
import { CompareMonthsUseCase } from '@app/insight/use-cases/compare-months.use-case';
import { GetAnnualInsightsUseCase } from '@app/insight/use-cases/get-annual-insights.use-case';
import { GetMonthlyInsightsUseCase } from '@app/insight/use-cases/get-monthly-insights.use-case';
import type { User } from '@app/user/entities/user.entity';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({ path: 'insights', version: '1' })
export class InsightController {
  public constructor(
    private readonly getMonthlyInsightsUseCase: GetMonthlyInsightsUseCase,
    private readonly getAnnualInsightsUseCase: GetAnnualInsightsUseCase,
    private readonly compareMonthsUseCase: CompareMonthsUseCase
  ) {}

  @Get('annual')
  @HttpCode(HttpStatus.OK)
  public async annual(@Query() params: GetAnnualInsightsQuery, @UserDecorator() user: User) {
    return this.getAnnualInsightsUseCase.handle({ year: params.year, user });
  }

  @Get('compare')
  @HttpCode(HttpStatus.OK)
  public async compare(@Query() params: CompareMonthsQuery, @UserDecorator() user: User) {
    return this.compareMonthsUseCase.handle({ monthA: params.monthA, monthB: params.monthB, user });
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: GetInsightsQuery, @UserDecorator() user: User) {
    return this.getMonthlyInsightsUseCase.handle({ month: params.month, user });
  }
}

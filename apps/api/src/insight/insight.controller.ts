import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { GetInsightsQuery } from '@app/insight/dtos/get-insights.dto';
import { GetMonthlyInsightsUseCase } from '@app/insight/use-cases/get-monthly-insights.use-case';
import type { User } from '@app/user/entities/user.entity';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({ path: 'insights', version: '1' })
export class InsightController {
  public constructor(private readonly getMonthlyInsightsUseCase: GetMonthlyInsightsUseCase) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: GetInsightsQuery, @UserDecorator() user: User) {
    return this.getMonthlyInsightsUseCase.handle({ month: params.month, user });
  }
}

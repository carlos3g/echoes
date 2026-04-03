import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { InsightRepositoryContract } from '@app/insight/contracts/insight-repository.contract';
import { InsightController } from '@app/insight/insight.controller';
import { PrismaInsightRepository } from '@app/insight/repositories/prisma-insight.repository';
import { CompareMonthsUseCase } from '@app/insight/use-cases/compare-months.use-case';
import { GetAnnualInsightsUseCase } from '@app/insight/use-cases/get-annual-insights.use-case';
import { GetMonthlyInsightsUseCase } from '@app/insight/use-cases/get-monthly-insights.use-case';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [InsightController],
  providers: [
    {
      provide: InsightRepositoryContract,
      useClass: PrismaInsightRepository,
    },
    GetMonthlyInsightsUseCase,
    GetAnnualInsightsUseCase,
    CompareMonthsUseCase,
  ],
})
export class InsightModule {}

import { AdminController } from '@app/admin/admin.controller';
import { AdminRepositoryContract } from '@app/admin/contracts/admin-repository.contract';
import { PrismaAdminRepository } from '@app/admin/repositories/prisma-admin.repository';
import { GetAnalyticsOverviewUseCase } from '@app/admin/use-cases/get-analytics-overview.use-case';
import { GetQuoteActivityUseCase } from '@app/admin/use-cases/get-quote-activity.use-case';
import { GetUserGrowthUseCase } from '@app/admin/use-cases/get-user-growth.use-case';
import { AdminListUsersPaginatedUseCase } from '@app/admin/use-cases/list-users-paginated.use-case';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [
    {
      provide: AdminRepositoryContract,
      useClass: PrismaAdminRepository,
    },
    GetAnalyticsOverviewUseCase,
    GetUserGrowthUseCase,
    GetQuoteActivityUseCase,
    AdminListUsersPaginatedUseCase,
  ],
})
export class AdminModule {}

import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { ActivityRepositoryContract } from '@app/activity/contracts/activity-repository.contract';
import { FeedEventRepositoryContract } from '@app/activity/contracts/feed-event-repository.contract';
import { ActivityController } from '@app/activity/activity.controller';
import { PrismaActivityRepository } from '@app/activity/repositories/prisma-activity.repository';
import { PrismaFeedEventRepository } from '@app/activity/repositories/prisma-feed-event.repository';
import { ListActivityPaginatedUseCase } from '@app/activity/use-cases/list-activity-paginated.use-case';
import { ListFeedPaginatedUseCase } from '@app/activity/use-cases/list-feed-paginated.use-case';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [ActivityController],
  providers: [
    {
      provide: ActivityRepositoryContract,
      useClass: PrismaActivityRepository,
    },
    {
      provide: FeedEventRepositoryContract,
      useClass: PrismaFeedEventRepository,
    },
    ListActivityPaginatedUseCase,
    ListFeedPaginatedUseCase,
  ],
  exports: [FeedEventRepositoryContract],
})
export class ActivityModule {}

import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { SessionRepositoryContract } from '@app/session/contracts/session-repository.contract';
import { PrismaSessionRepository } from '@app/session/repositories/prisma-session.repository';
import { SessionController } from '@app/session/session.controller';
import { SyncSessionsUseCase } from '@app/session/use-cases/sync-sessions.use-case';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [SessionController],
  providers: [
    {
      provide: SessionRepositoryContract,
      useClass: PrismaSessionRepository,
    },
    SyncSessionsUseCase,
  ],
})
export class SessionModule {}

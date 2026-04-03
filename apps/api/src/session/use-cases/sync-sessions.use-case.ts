import { SessionRepositoryContract } from '@app/session/contracts/session-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

interface SyncSessionsInput {
  user: User;
  sessions: Array<{ startedAt: string; endedAt: string; quotesViewed: number }>;
}

@Injectable()
export class SyncSessionsUseCase implements UseCaseHandler {
  public constructor(private readonly sessionRepository: SessionRepositoryContract) {}

  public async handle(input: SyncSessionsInput): Promise<{ created: number }> {
    const mapped = input.sessions.map((s) => ({
      userId: input.user.id,
      startedAt: new Date(s.startedAt),
      endedAt: new Date(s.endedAt),
      quotesViewed: s.quotesViewed,
    }));

    const created = await this.sessionRepository.batchCreate(mapped);

    return { created };
  }
}

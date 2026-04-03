import type { SessionInput } from '@app/session/contracts/session-repository.contract';
import { SessionRepositoryContract } from '@app/session/contracts/session-repository.contract';
import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaSessionRepository implements SessionRepositoryContract {
  public constructor(private readonly prismaManager: PrismaManagerService) {}

  public async batchCreate(sessions: SessionInput[]): Promise<number> {
    if (sessions.length === 0) return 0;

    const client = this.prismaManager.getClient();

    const userId = BigInt(sessions[0].userId);
    const startedAtDates = sessions.map((s) => s.startedAt);

    const existing = await client.userSession.findMany({
      where: {
        userId,
        startedAt: { in: startedAtDates },
      },
      select: { startedAt: true },
    });

    const existingSet = new Set(existing.map((e) => e.startedAt.getTime()));

    const newSessions = sessions.filter((s) => !existingSet.has(s.startedAt.getTime()));

    if (newSessions.length === 0) return 0;

    const result = await client.userSession.createMany({
      data: newSessions.map((s) => ({
        userId: BigInt(s.userId),
        startedAt: s.startedAt,
        endedAt: s.endedAt,
        quotesViewed: s.quotesViewed,
      })),
    });

    return result.count;
  }
}

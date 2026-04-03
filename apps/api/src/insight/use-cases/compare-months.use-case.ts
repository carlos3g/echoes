import { InsightRepositoryContract } from '@app/insight/contracts/insight-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export type CompareMonthsInput = {
  monthA: string;
  monthB: string;
  user: User;
};

type MonthSummary = {
  month: string;
  quotesRead: number;
  quotesFavorited: number;
  quotesShared: number;
  authorsFavorited: number;
  tagsCreated: number;
  uniqueAuthors: number;
};

export type CompareMonthsOutput = {
  monthA: MonthSummary;
  monthB: MonthSummary;
  deltas: Record<string, number>;
};

function computeDelta(a: number, b: number): number {
  if (a === 0) {
    return b > 0 ? 100 : 0;
  }

  return Math.round(((b - a) / a) * 100);
}

function parseMonthRange(month: string): { start: Date; end: Date } {
  const [year, monthNum] = month.split('-').map(Number) as [number, number];
  const start = new Date(year, monthNum - 1, 1);
  const end = new Date(year, monthNum, 1);

  return { start, end };
}

async function fetchMonthSummary(
  repo: InsightRepositoryContract,
  userId: number,
  month: string
): Promise<MonthSummary> {
  const range = parseMonthRange(month);

  const [quotesRead, quotesFavorited, quotesShared, authorsFavorited, tagsCreated, uniqueAuthors] = await Promise.all([
    repo.countQuoteViews(userId, range),
    repo.countQuoteFavorites(userId, range),
    repo.countShares(userId, range),
    repo.countAuthorFavorites(userId, range),
    repo.countTagsCreated(userId, range),
    repo.countUniqueAuthorsRead(userId, range),
  ]);

  return { month, quotesRead, quotesFavorited, quotesShared, authorsFavorited, tagsCreated, uniqueAuthors };
}

@Injectable()
export class CompareMonthsUseCase implements UseCaseHandler {
  public constructor(private readonly insightRepository: InsightRepositoryContract) {}

  public async handle(input: CompareMonthsInput): Promise<CompareMonthsOutput> {
    const { monthA, monthB, user } = input;

    const [summaryA, summaryB] = await Promise.all([
      fetchMonthSummary(this.insightRepository, user.id, monthA),
      fetchMonthSummary(this.insightRepository, user.id, monthB),
    ]);

    const deltas: Record<string, number> = {
      quotesRead: computeDelta(summaryA.quotesRead, summaryB.quotesRead),
      quotesFavorited: computeDelta(summaryA.quotesFavorited, summaryB.quotesFavorited),
      quotesShared: computeDelta(summaryA.quotesShared, summaryB.quotesShared),
      authorsFavorited: computeDelta(summaryA.authorsFavorited, summaryB.authorsFavorited),
      tagsCreated: computeDelta(summaryA.tagsCreated, summaryB.tagsCreated),
      uniqueAuthors: computeDelta(summaryA.uniqueAuthors, summaryB.uniqueAuthors),
    };

    return { monthA: summaryA, monthB: summaryB, deltas };
  }
}

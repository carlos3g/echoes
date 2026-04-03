import { InsightRepositoryContract } from '@app/insight/contracts/insight-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export type GetAnnualInsightsInput = {
  year: string;
  user: User;
};

export type GetAnnualInsightsOutput = {
  year: number;
  months: Array<{
    month: string;
    reads: number;
    favorites: number;
    shares: number;
    diversityScore: number;
  }>;
};

@Injectable()
export class GetAnnualInsightsUseCase implements UseCaseHandler {
  public constructor(private readonly insightRepository: InsightRepositoryContract) {}

  public async handle(input: GetAnnualInsightsInput): Promise<GetAnnualInsightsOutput> {
    const { year, user } = input;
    const yearNum = Number(year);

    const monthPromises = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthLabel = `${year}-${String(monthNum).padStart(2, '0')}`;
      const start = new Date(yearNum, i, 1);
      const end = new Date(yearNum, i + 1, 1);
      const range = { start, end };

      return Promise.all([
        this.insightRepository.countQuoteViews(user.id, range),
        this.insightRepository.countQuoteFavorites(user.id, range),
        this.insightRepository.countShares(user.id, range),
        this.insightRepository.getDiversityScore(user.id, range),
      ]).then(([reads, favorites, shares, diversityScore]) => ({
        month: monthLabel,
        reads,
        favorites,
        shares,
        diversityScore,
      }));
    });

    const months = await Promise.all(monthPromises);

    return { year: yearNum, months };
  }
}

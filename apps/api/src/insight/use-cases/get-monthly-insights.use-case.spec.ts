import type { InsightRepositoryContract } from '@app/insight/contracts/insight-repository.contract';
import { GetMonthlyInsightsUseCase } from '@app/insight/use-cases/get-monthly-insights.use-case';
import type { User } from '@app/user/entities/user.entity';

const makeRepositoryMock = () => ({
  countQuoteViews: jest.fn(),
  countQuoteFavorites: jest.fn(),
  countAuthorFavorites: jest.fn(),
  countShares: jest.fn(),
  countTagsCreated: jest.fn(),
  countUniqueAuthorsRead: jest.fn(),
  getDailyActivity: jest.fn(),
  getTopCategories: jest.fn(),
  getHeatmap: jest.fn(),
  getTopAuthors: jest.fn(),
  getSharesByPlatform: jest.fn(),
  getRereadCount: jest.fn(),
  getAvgQuotesPerAuthor: jest.fn(),
  getHourlyHeatmap: jest.fn(),
  getSessionMetrics: jest.fn(),
  getTopRereads: jest.fn(),
  getAuthorBubbles: jest.fn(),
  getCurrentStreak: jest.fn(),
  getLongestStreak: jest.fn(),
  updateLongestStreak: jest.fn(),
  getDiversityScore: jest.fn(),
});

const makeUser = (): User =>
  ({
    id: 1,
    uuid: 'test-uuid',
    name: 'Test',
    email: 'test@test.com',
    username: 'test',
    password: 'hash',
    emailVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as User;

const setupAllZeros = (mockRepository: ReturnType<typeof makeRepositoryMock>) => {
  mockRepository.countQuoteViews.mockResolvedValue(0);
  mockRepository.countQuoteFavorites.mockResolvedValue(0);
  mockRepository.countAuthorFavorites.mockResolvedValue(0);
  mockRepository.countShares.mockResolvedValue(0);
  mockRepository.countTagsCreated.mockResolvedValue(0);
  mockRepository.countUniqueAuthorsRead.mockResolvedValue(0);
  mockRepository.getDailyActivity.mockResolvedValue([]);
  mockRepository.getTopCategories.mockResolvedValue([]);
  mockRepository.getHeatmap.mockResolvedValue([]);
  mockRepository.getTopAuthors.mockResolvedValue([]);
  mockRepository.getSharesByPlatform.mockResolvedValue([]);
  mockRepository.getRereadCount.mockResolvedValue(0);
  mockRepository.getAvgQuotesPerAuthor.mockResolvedValue(0);
  mockRepository.getHourlyHeatmap.mockResolvedValue([]);
  mockRepository.getSessionMetrics.mockResolvedValue({
    avgDuration: 0,
    avgQuotes: 0,
    total: 0,
    distribution: { under1: 0, from1to5: 0, from5to15: 0, over15: 0 },
  });
  mockRepository.getTopRereads.mockResolvedValue([]);
  mockRepository.getAuthorBubbles.mockResolvedValue([]);
  mockRepository.getCurrentStreak.mockResolvedValue(0);
  mockRepository.getLongestStreak.mockResolvedValue(0);
  mockRepository.updateLongestStreak.mockResolvedValue(undefined);
  mockRepository.getDiversityScore.mockResolvedValue(0);
};

describe('GetMonthlyInsightsUseCase', () => {
  let useCase: GetMonthlyInsightsUseCase;
  let mockRepository: ReturnType<typeof makeRepositoryMock>;

  beforeEach(() => {
    mockRepository = makeRepositoryMock();
    useCase = new GetMonthlyInsightsUseCase(mockRepository as unknown as InsightRepositoryContract);
  });

  describe('handle', () => {
    it('returns all zeros when repository returns zeros for everything', async () => {
      setupAllZeros(mockRepository);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      expect(result.summary.quotesRead.current).toBe(0);
      expect(result.summary.quotesRead.previous).toBe(0);
      expect(result.summary.quotesFavorited.current).toBe(0);
      expect(result.summary.quotesShared.current).toBe(0);
      expect(result.summary.authorsFavorited.current).toBe(0);
      expect(result.summary.tagsCreated.current).toBe(0);
      expect(result.summary.uniqueAuthors.current).toBe(0);
      expect(result.readingProfile.exploration).toBe(0);
      expect(result.readingProfile.collection).toBe(0);
      expect(result.readingProfile.sharing).toBe(0);
      expect(result.readingProfile.consistency).toBe(0);
      expect(result.readingProfile.depth).toBe(0);
    });

    it('computes previousMonth correctly for a mid-year month', async () => {
      setupAllZeros(mockRepository);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      expect(result.previousMonth).toBe('2026-02');
    });

    it('computes previousMonth correctly at year boundary (January → December)', async () => {
      setupAllZeros(mockRepository);

      const result = await useCase.handle({ month: '2026-01', user: makeUser() });

      expect(result.previousMonth).toBe('2025-12');
    });

    it('groups daily activity into correct weeks', async () => {
      setupAllZeros(mockRepository);
      mockRepository.getDailyActivity.mockResolvedValue([
        { date: '2026-03-01', reads: 2, favorites: 1, shares: 0 }, // week 1
        { date: '2026-03-07', reads: 1, favorites: 0, shares: 1 }, // week 1
        { date: '2026-03-08', reads: 3, favorites: 2, shares: 0 }, // week 2
        { date: '2026-03-14', reads: 1, favorites: 0, shares: 0 }, // week 2
        { date: '2026-03-22', reads: 5, favorites: 3, shares: 2 }, // week 4
      ]);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      const week1 = result.weeklyActivity.find((w) => w.week === 1);
      const week2 = result.weeklyActivity.find((w) => w.week === 2);
      const week4 = result.weeklyActivity.find((w) => w.week === 4);

      expect(week1).toEqual({ week: 1, reads: 3, favorites: 1, shares: 1 });
      expect(week2).toEqual({ week: 2, reads: 4, favorites: 2, shares: 0 });
      expect(week4).toEqual({ week: 4, reads: 5, favorites: 3, shares: 2 });
    });

    it('computes heatmap intensity correctly', async () => {
      setupAllZeros(mockRepository);
      mockRepository.getDailyActivity.mockResolvedValue([
        { date: '2026-03-01', reads: 0, favorites: 0, shares: 0 },
        { date: '2026-03-02', reads: 1, favorites: 0, shares: 0 },
        { date: '2026-03-03', reads: 3, favorites: 0, shares: 0 },
        { date: '2026-03-04', reads: 6, favorites: 0, shares: 0 },
      ]);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      expect(result.heatmap[0].intensity).toBe(0); // reads 0 → 0
      expect(result.heatmap[1].intensity).toBe(1); // reads 1 → 1
      expect(result.heatmap[2].intensity).toBe(2); // reads 3 → 2
      expect(result.heatmap[3].intensity).toBe(3); // reads 6 → 3
    });

    it('computes reading profile exploration score correctly', async () => {
      setupAllZeros(mockRepository);
      // uniqueAuthors=5, totalReads=10 → min(100, round(5/10 * 200)) = 100
      mockRepository.countQuoteViews.mockResolvedValue(10);
      mockRepository.countUniqueAuthorsRead.mockResolvedValue(5);
      mockRepository.getDailyActivity.mockResolvedValue([{ date: '2026-03-01', reads: 10, favorites: 0, shares: 0 }]);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      expect(result.readingProfile.exploration).toBe(100);
    });

    it('computes reading profile consistency score correctly', async () => {
      setupAllZeros(mockRepository);
      // daysActive=15, daysInMonth=31 for March → consistency = round(15/31 * 100) = 48
      // Use February 2026 (28 days) for exact 50%: daysActive=14, daysInMonth=28
      mockRepository.countQuoteViews.mockResolvedValue(1);
      const dailyDates = Array.from({ length: 14 }, (_, i) => ({
        date: `2026-02-${String(i + 1).padStart(2, '0')}`,
        reads: 0,
        favorites: 0,
        shares: 0,
      }));
      mockRepository.getDailyActivity.mockResolvedValue(dailyDates);

      const result = await useCase.handle({ month: '2026-02', user: makeUser() });

      // daysActive=14, daysInMonth=28 → consistency = round(14/28 * 100) = 50
      expect(result.readingProfile.consistency).toBe(50);
    });

    it('sets reading profile to all zeros when there are no reads', async () => {
      setupAllZeros(mockRepository);
      mockRepository.countQuoteViews.mockResolvedValue(0);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      expect(result.readingProfile).toEqual({
        exploration: 0,
        collection: 0,
        sharing: 0,
        consistency: 0,
        depth: 0,
      });
    });

    it('groups overflow categories into "Outros"', async () => {
      setupAllZeros(mockRepository);
      // Use case fetches top 3 categories from repo; total reads = 30
      // Top 3 sum = 10+9+8 = 27; Outros = 30 - 27 = 3
      mockRepository.countQuoteViews.mockResolvedValue(30);
      mockRepository.getTopCategories.mockResolvedValue([
        { title: 'Cat1', count: 10 },
        { title: 'Cat2', count: 9 },
        { title: 'Cat3', count: 8 },
      ]);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      const titles = result.topCategories.map((c) => c.title);
      expect(titles).toContain('Cat1');
      expect(titles).toContain('Cat2');
      expect(titles).toContain('Cat3');
      expect(titles).toContain('Outros');

      const outros = result.topCategories.find((c) => c.title === 'Outros');
      expect(outros!.count).toBe(3); // 30 - 27
    });

    it('does not add "Outros" when total reads equal category sum', async () => {
      setupAllZeros(mockRepository);
      // Total reads = 15, category sum = 10+5 = 15, so no overflow
      mockRepository.countQuoteViews.mockResolvedValue(15);
      mockRepository.getTopCategories.mockResolvedValue([
        { title: 'Cat1', count: 10 },
        { title: 'Cat2', count: 5 },
      ]);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      const titles = result.topCategories.map((c) => c.title);
      expect(titles).not.toContain('Outros');
      expect(result.topCategories).toHaveLength(2);
    });

    it('sets correct current and previous values in summary', async () => {
      setupAllZeros(mockRepository);
      // countQuoteViews is called twice: once for current range, once for previous range
      mockRepository.countQuoteViews.mockResolvedValueOnce(42).mockResolvedValueOnce(17);

      const result = await useCase.handle({ month: '2026-03', user: makeUser() });

      expect(result.summary.quotesRead.current).toBe(42);
      expect(result.summary.quotesRead.previous).toBe(17);
    });
  });
});

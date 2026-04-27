import { AuthorRepositoryContract } from '@app/author/contracts/author-repository.contract';
import { CategoryRepositoryContract } from '@app/category/contracts/category-repository.contract';
import type { GetMonthlyInsightsOutput } from '@app/insight/use-cases/get-monthly-insights.use-case';
import { QuoteRepositoryContract } from '@app/quote/contracts/quote-repository.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { Category } from '@app/category/entities/category.entity';
import type { Quote } from '@app/quote/entities/quote.entity';
import type { User } from '@app/user/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { getAccessToken } from '@test/auth';
import { authorFactory, categoryFactory, quoteFactory, userFactory } from '@test/factories';
import { app, prisma, server } from '@test/server';
import * as request from 'supertest';

// ─── Repository handles ───────────────────────────────────────────────────────

let userRepository: UserRepositoryContract;
let quoteRepository: QuoteRepositoryContract;
let authorRepository: AuthorRepositoryContract;
let categoryRepository: CategoryRepositoryContract;

// ─── Per-test state ───────────────────────────────────────────────────────────

let user: User;
let token: string;

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeAll(() => {
  userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);
  quoteRepository = app.get<QuoteRepositoryContract>(QuoteRepositoryContract);
  authorRepository = app.get<AuthorRepositoryContract>(AuthorRepositoryContract);
  categoryRepository = app.get<CategoryRepositoryContract>(CategoryRepositoryContract);
});

beforeEach(async () => {
  user = await userRepository.create(userFactory());
  token = await getAccessToken(app, { email: user.email });
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInsights = (authToken: string, month: string) =>
  request(server).get('/insights').auth(authToken, { type: 'bearer' }).query({ month });

const body = (response: request.Response): GetMonthlyInsightsOutput => response.body as GetMonthlyInsightsOutput;

const createView = (userId: number, quoteId: number, isoDate: string) =>
  prisma.quoteView.create({ data: { userId, quoteId, createdAt: new Date(isoDate) } });

const createViews = (userId: number, quoteId: number, isoDates: string[]) =>
  Promise.all(isoDates.map((d) => createView(userId, quoteId, d)));

const createFavorite = (userId: number, quoteId: number, isoDate: string) =>
  prisma.userFavoriteQuote.create({ data: { userId, quoteId, createdAt: new Date(isoDate) } });

const createShare = (userId: number, quoteId: number, platform: string, isoDate: string) =>
  prisma.quoteShare.create({
    data: { userId, quoteId, type: 'image', platform, createdAt: new Date(isoDate) },
  });

const createAuthorFavorite = (userId: number, authorId: number, isoDate: string) =>
  prisma.userFavoriteAuthor.create({ data: { userId, authorId, createdAt: new Date(isoDate) } });

const linkCategory = (quoteId: number, categoryId: number) =>
  prisma.quote.update({
    where: { id: quoteId },
    data: { categories: { connect: { id: categoryId } } },
  });

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('(GET) /insights', () => {
  // ── Authentication & Validation ──────────────────────────────────────────────

  describe('authentication & validation', () => {
    it('should return 401 when not authenticated', async () => {
      const response = await request(server).get('/insights').query({ month: '2026-03' });

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 for month "invalid"', async () => {
      const response = await getInsights(token, 'invalid');

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for month "2026" (year only)', async () => {
      const response = await getInsights(token, '2026');

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for month "13-2026" (wrong order)', async () => {
      const response = await getInsights(token, '13-2026');

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 for month "2026-13" (month out of range)', async () => {
      const response = await getInsights(token, '2026-13');

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return 200 for a valid month format', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  // ── Empty month ──────────────────────────────────────────────────────────────

  describe('empty month', () => {
    it('should return all zeros in summary and empty arrays when there is no activity', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        month: '2026-03',
        previousMonth: '2026-02',
        summary: {
          quotesRead: { current: 0, previous: 0 },
          quotesFavorited: { current: 0, previous: 0 },
          quotesShared: { current: 0, previous: 0 },
          authorsFavorited: { current: 0, previous: 0 },
          tagsCreated: { current: 0, previous: 0 },
          uniqueAuthors: { current: 0, previous: 0 },
        },
        readingProfile: { exploration: 0, collection: 0, sharing: 0, consistency: 0, depth: 0 },
      });
      expect(body(response).dailyActivity).toEqual([]);
      expect(body(response).weeklyActivity).toEqual([]);
      expect(body(response).topCategories).toEqual([]);
      expect(body(response).topAuthors).toEqual([]);
      expect(body(response).sharesByPlatform).toEqual([]);
      expect(body(response).heatmap).toEqual([]);
    });
  });

  // ── Summary counts ───────────────────────────────────────────────────────────

  describe('summary counts', () => {
    it('should count quote views correctly for the month', async () => {
      const q1 = await quoteRepository.create(quoteFactory());
      const q2 = await quoteRepository.create(quoteFactory());

      await createView(user.id, q1.id, '2026-03-10T09:00:00Z');
      await createView(user.id, q2.id, '2026-03-20T14:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(2);
    });

    it('should count quote favorites correctly for the month', async () => {
      const q1 = await quoteRepository.create(quoteFactory());
      const q2 = await quoteRepository.create(quoteFactory());

      await createFavorite(user.id, q1.id, '2026-03-05T10:00:00Z');
      await createFavorite(user.id, q2.id, '2026-03-15T10:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesFavorited.current).toBe(2);
    });

    it('should count author favorites correctly for the month', async () => {
      const a1 = await authorRepository.create(authorFactory());
      const a2 = await authorRepository.create(authorFactory());

      await createAuthorFavorite(user.id, a1.id, '2026-03-01T08:00:00Z');
      await createAuthorFavorite(user.id, a2.id, '2026-03-12T08:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.authorsFavorited.current).toBe(2);
    });

    it('should count shares correctly for the month', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createShare(user.id, q.id, 'instagram', '2026-03-08T10:00:00Z');
      await createShare(user.id, q.id, 'twitter', '2026-03-09T10:00:00Z');
      await createShare(user.id, q.id, 'whatsapp', '2026-03-10T10:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesShared.current).toBe(3);
    });

    it('should count tags created correctly for the month', async () => {
      await prisma.tag.create({
        data: {
          userId: user.id,
          title: 'tag-a',
          uuid: `tag-uuid-a-${Date.now()}`,
          createdAt: new Date('2026-03-05T10:00:00Z'),
        },
      });
      await prisma.tag.create({
        data: {
          userId: user.id,
          title: 'tag-b',
          uuid: `tag-uuid-b-${Date.now()}`,
          createdAt: new Date('2026-03-20T10:00:00Z'),
        },
      });

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.tagsCreated.current).toBe(2);
    });

    it('should count unique authors read correctly (2 quotes from same author = 1 unique)', async () => {
      const author = await authorRepository.create(authorFactory());
      const q1 = await quoteRepository.create({ ...quoteFactory(), authorId: author.id });
      const q2 = await quoteRepository.create({ ...quoteFactory(), authorId: author.id });

      await createView(user.id, q1.id, '2026-03-10T09:00:00Z');
      await createView(user.id, q2.id, '2026-03-15T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.uniqueAuthors.current).toBe(1);
    });

    it('should include previous month comparison values', async () => {
      const q = await quoteRepository.create(quoteFactory());

      // Current month (March)
      await createView(user.id, q.id, '2026-03-10T09:00:00Z');
      await createView(user.id, q.id, '2026-03-11T09:00:00Z');

      // Previous month (February)
      await createView(user.id, q.id, '2026-02-10T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(2);
      expect(body(response).summary.quotesRead.previous).toBe(1);
    });
  });

  // ── Data isolation ───────────────────────────────────────────────────────────

  describe('data isolation', () => {
    it('should not include other users quote views', async () => {
      const otherUser = await userRepository.create(userFactory());
      const q = await quoteRepository.create(quoteFactory());

      await createView(otherUser.id, q.id, '2026-03-15T10:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(0);
    });

    it('should not include other users favorites', async () => {
      const otherUser = await userRepository.create(userFactory());
      const q = await quoteRepository.create(quoteFactory());

      await createFavorite(otherUser.id, q.id, '2026-03-15T10:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesFavorited.current).toBe(0);
    });

    it('should not include data from other months (April data not visible when querying March)', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createView(user.id, q.id, '2026-03-31T23:00:00Z'); // March
      await createView(user.id, q.id, '2026-04-01T00:00:00Z'); // April — must not be counted

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(1);
    });
  });

  // ── Daily activity ───────────────────────────────────────────────────────────

  describe('daily activity', () => {
    it('should return correct read/favorite/share counts per active day', async () => {
      const q1 = await quoteRepository.create(quoteFactory());
      const q2 = await quoteRepository.create(quoteFactory());

      // Day 10: 2 reads, 1 favorite, 1 share
      await createView(user.id, q1.id, '2026-03-10T09:00:00Z');
      await createView(user.id, q2.id, '2026-03-10T10:00:00Z');
      await createFavorite(user.id, q1.id, '2026-03-10T11:00:00Z');
      await createShare(user.id, q1.id, 'instagram', '2026-03-10T12:00:00Z');

      // Day 20: 1 read
      await createView(user.id, q1.id, '2026-03-20T08:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const day10 = body(response).dailyActivity.find((d) => d.date === '2026-03-10');
      const day20 = body(response).dailyActivity.find((d) => d.date === '2026-03-20');

      expect(day10).toBeDefined();
      expect(day10).toMatchObject({ reads: 2, favorites: 1, shares: 1 });

      expect(day20).toBeDefined();
      expect(day20).toMatchObject({ reads: 1, favorites: 0, shares: 0 });
    });

    it('should not include days with no activity', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createView(user.id, q.id, '2026-03-15T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).dailyActivity).toHaveLength(1);
      expect(body(response).dailyActivity[0].date).toBe('2026-03-15');
    });
  });

  // ── Weekly activity ──────────────────────────────────────────────────────────

  describe('weekly activity', () => {
    it('should group daily data into correct weeks (day 1-7 = week 1, 8-14 = week 2, etc.)', async () => {
      const q = await quoteRepository.create(quoteFactory());

      // Week 1: day 3 & 7 → 2 reads
      await createView(user.id, q.id, '2026-03-03T09:00:00Z');
      await createView(user.id, q.id, '2026-03-07T09:00:00Z');

      // Week 2: day 10 → 1 read
      await createView(user.id, q.id, '2026-03-10T09:00:00Z');

      // Week 3: day 18 → 1 read
      await createView(user.id, q.id, '2026-03-18T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const weekly: Array<{ week: number; reads: number; favorites: number; shares: number }> =
        body(response).weeklyActivity;

      const w1 = weekly.find((w) => w.week === 1);
      const w2 = weekly.find((w) => w.week === 2);
      const w3 = weekly.find((w) => w.week === 3);

      expect(w1).toBeDefined();
      expect(w1!.reads).toBe(2);

      expect(w2).toBeDefined();
      expect(w2!.reads).toBe(1);

      expect(w3).toBeDefined();
      expect(w3!.reads).toBe(1);
    });
  });

  // ── Top categories ───────────────────────────────────────────────────────────

  describe('top categories', () => {
    it('should return top categories sorted by count descending', async () => {
      const cat1 = await categoryRepository.create(categoryFactory());
      const cat2 = await categoryRepository.create(categoryFactory());

      const q1 = await quoteRepository.create(quoteFactory());
      const q2 = await quoteRepository.create(quoteFactory());
      const q3 = await quoteRepository.create(quoteFactory());

      await linkCategory(q1.id, cat1.id);
      await linkCategory(q2.id, cat1.id);
      await linkCategory(q3.id, cat2.id);

      await createView(user.id, q1.id, '2026-03-05T09:00:00Z');
      await createView(user.id, q2.id, '2026-03-06T09:00:00Z');
      await createView(user.id, q3.id, '2026-03-07T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const topCategories: Array<{ title: string; count: number; percentage: number }> = body(response).topCategories;

      expect(topCategories.length).toBeGreaterThanOrEqual(2);
      expect(topCategories[0].count).toBeGreaterThanOrEqual(topCategories[1].count);
      expect(topCategories[0].title).toBe(cat1.title);
    });

    it('should include "Outros" bucket when there are more than 5 categories', async () => {
      const quotes: Quote[] = [];
      const cats: Category[] = [];

      // Create 7 categories, each viewed once — top 5 shown, remaining 2 → Outros
      for (let i = 0; i < 7; i++) {
        const cat = await categoryRepository.create(categoryFactory());
        const q = await quoteRepository.create(quoteFactory());
        await linkCategory(q.id, cat.id);
        await createView(user.id, q.id, `2026-03-0${(i % 9) + 1}T09:00:00Z`);
        cats.push(cat);
        quotes.push(q);
      }

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const topCategories: Array<{ title: string; count: number }> = body(response).topCategories;
      const outros = topCategories.find((c) => c.title === 'Outros');

      expect(outros).toBeDefined();
      expect(outros!.count).toBe(2);
    });

    it('should return empty array when no categorized quotes were viewed', async () => {
      const q = await quoteRepository.create(quoteFactory()); // no category linked
      await createView(user.id, q.id, '2026-03-10T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).topCategories).toEqual([]);
    });

    it('should include percentage for each category', async () => {
      const cat = await categoryRepository.create(categoryFactory());
      const q = await quoteRepository.create(quoteFactory());
      await linkCategory(q.id, cat.id);
      await createView(user.id, q.id, '2026-03-10T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const topCategories: Array<{ title: string; count: number; percentage: number }> = body(response).topCategories;

      expect(topCategories[0].percentage).toBe(100);
    });
  });

  // ── Heatmap ──────────────────────────────────────────────────────────────────

  describe('heatmap', () => {
    it('should return heatmap with intensity 1 for 1-2 reads', async () => {
      const q = await quoteRepository.create(quoteFactory());
      await createView(user.id, q.id, '2026-03-10T09:00:00Z'); // count = 1

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const entry = body(response).heatmap.find((h) => h.date === '2026-03-10');
      expect(entry).toBeDefined();
      expect(entry!.count).toBe(1);
      expect(entry!.intensity).toBe(1);
    });

    it('should return heatmap with intensity 2 for 3-5 reads', async () => {
      const q = await quoteRepository.create(quoteFactory());
      await createViews(user.id, q.id, [
        '2026-03-15T08:00:00Z',
        '2026-03-15T09:00:00Z',
        '2026-03-15T10:00:00Z',
        '2026-03-15T11:00:00Z',
      ]); // count = 4

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const entry = body(response).heatmap.find((h) => h.date === '2026-03-15');
      expect(entry).toBeDefined();
      expect(entry!.count).toBe(4);
      expect(entry!.intensity).toBe(2);
    });

    it('should return heatmap with intensity 3 for 6+ reads', async () => {
      const q = await quoteRepository.create(quoteFactory());
      await createViews(user.id, q.id, [
        '2026-03-20T07:00:00Z',
        '2026-03-20T08:00:00Z',
        '2026-03-20T09:00:00Z',
        '2026-03-20T10:00:00Z',
        '2026-03-20T11:00:00Z',
        '2026-03-20T12:00:00Z',
      ]); // count = 6

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const entry = body(response).heatmap.find((h) => h.date === '2026-03-20');
      expect(entry).toBeDefined();
      expect(entry!.count).toBe(6);
      expect(entry!.intensity).toBe(3);
    });

    it('should return empty heatmap when there are no reads', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).heatmap).toEqual([]);
    });
  });

  // ── Top authors ──────────────────────────────────────────────────────────────

  describe('top authors', () => {
    it('should return top authors sorted by quotes read descending', async () => {
      const author1 = await authorRepository.create(authorFactory());
      const author2 = await authorRepository.create(authorFactory());

      const q1 = await quoteRepository.create({ ...quoteFactory(), authorId: author1.id });
      const q2 = await quoteRepository.create({ ...quoteFactory(), authorId: author1.id });
      const q3 = await quoteRepository.create({ ...quoteFactory(), authorId: author2.id });

      await createView(user.id, q1.id, '2026-03-05T09:00:00Z');
      await createView(user.id, q2.id, '2026-03-06T09:00:00Z');
      await createView(user.id, q3.id, '2026-03-07T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const topAuthors: Array<{ name: string; quotesRead: number; uuid: string }> = body(response).topAuthors;

      expect(topAuthors).toHaveLength(2);
      expect(topAuthors[0].quotesRead).toBeGreaterThanOrEqual(topAuthors[1].quotesRead);
      expect(topAuthors[0].name).toBe(author1.name);
    });

    it('should exclude quotes without authors from top authors', async () => {
      const authorlessQuote = await quoteRepository.create(quoteFactory()); // no authorId
      await createView(user.id, authorlessQuote.id, '2026-03-10T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).topAuthors).toHaveLength(0);
    });

    it('should return the correct uuid for each author', async () => {
      const author = await authorRepository.create(authorFactory());
      const q = await quoteRepository.create({ ...quoteFactory(), authorId: author.id });
      await createView(user.id, q.id, '2026-03-10T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const topAuthors: Array<{ name: string; quotesRead: number; uuid: string }> = body(response).topAuthors;

      expect(topAuthors).toHaveLength(1);
      expect(topAuthors[0].uuid).toBe(author.uuid);
      expect(topAuthors[0].name).toBe(author.name);
    });
  });

  // ── Shares by platform ───────────────────────────────────────────────────────

  describe('shares by platform', () => {
    it('should group shares by platform and return counts', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createShare(user.id, q.id, 'instagram', '2026-03-05T09:00:00Z');
      await createShare(user.id, q.id, 'instagram', '2026-03-06T09:00:00Z');
      await createShare(user.id, q.id, 'twitter', '2026-03-07T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const sharesByPlatform: Array<{ platform: string; count: number }> = body(response).sharesByPlatform;

      const instagram = sharesByPlatform.find((s) => s.platform === 'instagram');
      const twitter = sharesByPlatform.find((s) => s.platform === 'twitter');

      expect(instagram).toBeDefined();
      expect(instagram!.count).toBe(2);

      expect(twitter).toBeDefined();
      expect(twitter!.count).toBe(1);
    });

    it('should return empty array when there are no shares', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).sharesByPlatform).toEqual([]);
    });
  });

  // ── Reading profile ──────────────────────────────────────────────────────────

  describe('reading profile', () => {
    it('should return all zeros when there are no reads (totalReads = 0)', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).readingProfile).toEqual({
        exploration: 0,
        collection: 0,
        sharing: 0,
        consistency: 0,
        depth: 0,
      });
    });

    it('should compute a non-zero exploration score when unique authors exist', async () => {
      const a1 = await authorRepository.create(authorFactory());
      const a2 = await authorRepository.create(authorFactory());

      const q1 = await quoteRepository.create({ ...quoteFactory(), authorId: a1.id });
      const q2 = await quoteRepository.create({ ...quoteFactory(), authorId: a2.id });

      await createView(user.id, q1.id, '2026-03-10T09:00:00Z');
      await createView(user.id, q2.id, '2026-03-11T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).readingProfile.exploration).toBeGreaterThan(0);
    });

    it('should compute consistency score as fraction of days active in month', async () => {
      const q = await quoteRepository.create(quoteFactory());

      // 31 days in March 2026. Active on days 1, 8, 15 → 3 / 31 * 100 ≈ 10
      await createView(user.id, q.id, '2026-03-01T09:00:00Z');
      await createView(user.id, q.id, '2026-03-08T09:00:00Z');
      await createView(user.id, q.id, '2026-03-15T09:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);

      const { consistency } = body(response).readingProfile;
      // daysActive=3, daysInMonth=31 → Math.round(3/31*100) = 10
      expect(consistency).toBe(Math.round((3 / 31) * 100));
    });

    it('should compute a non-zero collection score when quotes are favorited', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createView(user.id, q.id, '2026-03-10T09:00:00Z');
      await createFavorite(user.id, q.id, '2026-03-10T10:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).readingProfile.collection).toBeGreaterThan(0);
    });

    it('should compute a non-zero sharing score when shares exist', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createView(user.id, q.id, '2026-03-10T09:00:00Z');
      await createShare(user.id, q.id, 'whatsapp', '2026-03-10T10:00:00Z');

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).readingProfile.sharing).toBeGreaterThan(0);
    });
  });

  // ── Edge cases ───────────────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('should handle January correctly (previous month must be December of previous year)', async () => {
      const response = await getInsights(token, '2026-01');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).month).toBe('2026-01');
      expect(body(response).previousMonth).toBe('2025-12');
    });

    it('should handle December correctly (previous month is November)', async () => {
      const response = await getInsights(token, '2026-12');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).month).toBe('2026-12');
      expect(body(response).previousMonth).toBe('2026-11');
    });

    it('should work correctly for February (shorter month — 28 days in 2026)', async () => {
      const q = await quoteRepository.create(quoteFactory());

      // Active all 28 days of Feb 2026
      const dates = Array.from({ length: 28 }, (_, i) => {
        const day = String(i + 1).padStart(2, '0');
        return `2026-02-${day}T09:00:00Z`;
      });
      await createViews(user.id, q.id, dates);

      const response = await getInsights(token, '2026-02');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(28);
      // Active all 28 days → consistency = 100
      expect(body(response).readingProfile.consistency).toBe(100);
    });

    it('should include data exactly at the start of the month boundary', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createView(user.id, q.id, '2026-03-01T00:00:00Z'); // first moment of March

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(1);
    });

    it('should exclude data exactly at the start of the following month boundary', async () => {
      const q = await quoteRepository.create(quoteFactory());

      await createView(user.id, q.id, '2026-04-01T00:00:00Z'); // April — must not appear in March

      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary.quotesRead.current).toBe(0);
    });
  });

  // ── Response shape ───────────────────────────────────────────────────────────

  describe('response shape', () => {
    it('should include all top-level keys in the response', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('month');
      expect(response.body).toHaveProperty('previousMonth');
      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('dailyActivity');
      expect(response.body).toHaveProperty('weeklyActivity');
      expect(response.body).toHaveProperty('topCategories');
      expect(response.body).toHaveProperty('heatmap');
      expect(response.body).toHaveProperty('readingProfile');
      expect(response.body).toHaveProperty('topAuthors');
      expect(response.body).toHaveProperty('sharesByPlatform');
    });

    it('should include all summary sub-keys', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).summary).toHaveProperty('quotesRead');
      expect(body(response).summary).toHaveProperty('quotesFavorited');
      expect(body(response).summary).toHaveProperty('quotesShared');
      expect(body(response).summary).toHaveProperty('authorsFavorited');
      expect(body(response).summary).toHaveProperty('tagsCreated');
      expect(body(response).summary).toHaveProperty('uniqueAuthors');
    });

    it('should include all readingProfile sub-keys', async () => {
      const response = await getInsights(token, '2026-03');

      expect(response.status).toBe(HttpStatus.OK);
      expect(body(response).readingProfile).toHaveProperty('exploration');
      expect(body(response).readingProfile).toHaveProperty('collection');
      expect(body(response).readingProfile).toHaveProperty('sharing');
      expect(body(response).readingProfile).toHaveProperty('consistency');
      expect(body(response).readingProfile).toHaveProperty('depth');
    });
  });
});

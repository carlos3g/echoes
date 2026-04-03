import type { Prisma } from '../../generated/prisma/client';

const CATEGORIES = [
  'Filosofia',
  'Motivacional',
  'Amor',
  'Sabedoria',
  'Humor',
  'Ciência',
  'Política',
  'Literatura',
  'Espiritualidade',
  'Estoicismo',
];

const PLATFORMS = ['whatsapp', 'instagram', 'twitter', 'telegram', 'copy'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateWithHour(base: Date, hour: number): Date {
  const d = new Date(base);
  d.setHours(hour, randomInt(0, 59), randomInt(0, 59), 0);
  return d;
}

export class InsightsSeeder {
  public static async run(prisma: Prisma.TransactionClient): Promise<void> {
    const user = await prisma.user.findFirst({ where: { email: 'test@gmail.com' } });
    if (!user) throw new Error('Test user not found — run UsersSeeder first');

    const authors = await prisma.author.findMany();
    const quotes = await prisma.quote.findMany();

    if (quotes.length === 0) throw new Error('No quotes found — run QuotesSeeder first');

    // ── Categories ──────────────────────────────────────────────────────────
    const categories = await Promise.all(
      CATEGORIES.map((title) =>
        prisma.category.create({
          data: { uuid: crypto.randomUUID(), title },
        })
      )
    );

    // Assign 1-3 categories to each quote
    for (const quote of quotes) {
      const count = randomInt(1, 3);
      const shuffled = [...categories].sort(() => Math.random() - 0.5).slice(0, count);
      await prisma.quote.update({
        where: { id: quote.id },
        data: { categories: { connect: shuffled.map((c) => ({ id: c.id })) } },
      });
    }

    // ── Quote Views (last 90 days, heavy in recent months) ──────────────────
    // Create views spread across hours that simulate real reading patterns:
    // More reads at 8h, 12h, 18h-22h, weekends heavier in mornings
    const peakHours = [8, 9, 12, 13, 18, 19, 20, 21, 22];
    const viewData: Array<{ userId: bigint; quoteId: bigint; createdAt: Date }> = [];

    for (let daysBack = 0; daysBack < 90; daysBack++) {
      const day = daysAgo(daysBack);
      const dayOfWeek = day.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // More reads in recent months, fewer in older
      const recentFactor = daysBack < 30 ? 1.0 : daysBack < 60 ? 0.7 : 0.4;
      const baseReads = isWeekend ? randomInt(8, 15) : randomInt(4, 10);
      const numReads = Math.ceil(baseReads * recentFactor);

      // Skip some days to create natural gaps (for streak testing)
      if (daysBack > 15 && daysBack < 18) continue; // 3-day gap ~2 weeks ago
      if (daysBack === 45) continue; // 1-day gap

      for (let r = 0; r < numReads; r++) {
        const hour = Math.random() > 0.4 ? pick(peakHours) : randomInt(6, 23);
        viewData.push({
          userId: user.id,
          quoteId: pick(quotes).id,
          createdAt: dateWithHour(day, hour),
        });
      }
    }

    // Batch insert views
    for (let i = 0; i < viewData.length; i += 100) {
      await prisma.quoteView.createMany({ data: viewData.slice(i, i + 100) });
    }

    // ── Reread some quotes many times (for reread rate) ─────────────────────
    const rereadQuotes = quotes.slice(0, 8);
    for (const quote of rereadQuotes) {
      const times = randomInt(3, 8);
      const rereadData = Array.from({ length: times }, () => ({
        userId: user.id,
        quoteId: quote.id,
        createdAt: randomDate(daysAgo(60), new Date()),
      }));
      await prisma.quoteView.createMany({ data: rereadData });
    }

    // ── Favorite Quotes (spread across last 90 days) ────────────────────────
    const favQuotes = quotes.sort(() => Math.random() - 0.5).slice(0, 40);
    for (const quote of favQuotes) {
      await prisma.userFavoriteQuote.create({
        data: {
          userId: user.id,
          quoteId: quote.id,
          createdAt: randomDate(daysAgo(90), new Date()),
        },
      });
    }

    // ── Favorite Authors ────────────────────────────────────────────────────
    const favAuthors = authors.sort(() => Math.random() - 0.5).slice(0, 5);
    for (const author of favAuthors) {
      await prisma.userFavoriteAuthor.create({
        data: {
          userId: user.id,
          authorId: author.id,
          createdAt: randomDate(daysAgo(90), new Date()),
        },
      });
    }

    // ── Quote Shares (different platforms) ──────────────────────────────────
    const shareQuotes = quotes.sort(() => Math.random() - 0.5).slice(0, 25);
    for (const quote of shareQuotes) {
      await prisma.quoteShare.create({
        data: {
          userId: user.id,
          quoteId: quote.id,
          type: 'image',
          platform: pick(PLATFORMS),
          createdAt: randomDate(daysAgo(90), new Date()),
        },
      });
    }

    // ── Tags ────────────────────────────────────────────────────────────────
    const tagTitles = ['Favoritas', 'Para reler', 'Inspiração', 'Trabalho', 'Manhã', 'Noite', 'Filosofia pessoal'];
    for (const title of tagTitles) {
      await prisma.tag.create({
        data: {
          uuid: crypto.randomUUID(),
          title,
          userId: user.id,
          createdAt: randomDate(daysAgo(90), new Date()),
        },
      });
    }

    // ── Sessions (last 90 days) ─────────────────────────────────────────────
    const sessionData: Array<{ userId: bigint; startedAt: Date; endedAt: Date; quotesViewed: number }> = [];

    for (let daysBack = 0; daysBack < 90; daysBack++) {
      if (daysBack > 15 && daysBack < 18) continue; // match the view gap
      if (daysBack === 45) continue;

      const day = daysAgo(daysBack);
      const sessionsPerDay = randomInt(1, 3);

      for (let s = 0; s < sessionsPerDay; s++) {
        const hour = pick(peakHours);
        const startedAt = dateWithHour(day, hour);
        const durationMinutes = randomInt(1, 20);
        const endedAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
        const quotesViewed = randomInt(2, Math.max(3, durationMinutes));

        sessionData.push({ userId: user.id, startedAt, endedAt, quotesViewed });
      }
    }

    for (let i = 0; i < sessionData.length; i += 50) {
      await prisma.userSession.createMany({ data: sessionData.slice(i, i + 50) });
    }

    console.log(`  ✓ Insights seeded for test@gmail.com:`);
    console.log(`    ${viewData.length + rereadQuotes.length * 5} quote views`);
    console.log(`    ${favQuotes.length} favorite quotes`);
    console.log(`    ${favAuthors.length} favorite authors`);
    console.log(`    ${shareQuotes.length} shares`);
    console.log(`    ${tagTitles.length} tags`);
    console.log(`    ${sessionData.length} sessions`);
    console.log(`    ${categories.length} categories`);
  }
}

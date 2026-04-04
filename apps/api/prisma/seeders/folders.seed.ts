import type { Prisma } from '../../generated/prisma/client';

const FOLDER_COLORS = ['#C4796B', '#8B9E81', '#D4A574', '#7B8FA1', '#C9B1D0', '#E8C07D', '#6B8E7B'];

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

const FOLDERS = [
  {
    name: 'Manhãs de Reflexão',
    description: 'Citações para começar o dia com clareza',
    visibility: 'PUBLIC' as const,
    color: '#C4796B',
  },
  {
    name: 'Estoicismo Diário',
    description: 'Marco Aurélio, Sêneca e Epicteto para o dia a dia',
    visibility: 'PUBLIC' as const,
    color: '#8B9E81',
  },
  {
    name: 'Para Compartilhar',
    description: null,
    visibility: 'PUBLIC' as const,
    color: '#D4A574',
  },
  {
    name: 'Pessoal',
    description: 'Citações que me marcaram profundamente',
    visibility: 'PRIVATE' as const,
    color: '#7B8FA1',
  },
  {
    name: 'Trabalho & Foco',
    description: 'Produtividade e disciplina',
    visibility: 'PUBLIC' as const,
    color: '#E8C07D',
  },
  {
    name: 'Amor e Relações',
    description: 'Sobre conexões humanas',
    visibility: 'PRIVATE' as const,
    color: '#C9B1D0',
  },
];

export class FoldersSeeder {
  public static async run(prisma: Prisma.TransactionClient): Promise<void> {
    const user = await prisma.user.findFirst({ where: { email: 'test@gmail.com' } });
    if (!user) throw new Error('Test user not found — run UsersSeeder first');

    const quotes = await prisma.quote.findMany();
    if (quotes.length === 0) throw new Error('No quotes found — run QuotesSeeder first');

    const createdFolders = [];

    // ── Create folders ──────────────────────────────────────────────────
    for (let i = 0; i < FOLDERS.length; i++) {
      const folderData = FOLDERS[i];

      const folder = await prisma.folder.create({
        data: {
          uuid: crypto.randomUUID(),
          name: folderData.name,
          description: folderData.description,
          color: folderData.color,
          visibility: folderData.visibility,
          position: i,
          userId: user.id,
          createdAt: randomDate(daysAgo(60), daysAgo(30)),
        },
      });

      // Create OWNER member
      await prisma.folderMember.create({
        data: {
          folderId: folder.id,
          userId: user.id,
          role: 'OWNER',
        },
      });

      createdFolders.push(folder);
    }

    // ── Add quotes to folders ───────────────────────────────────────────
    const shuffledQuotes = [...quotes].sort(() => Math.random() - 0.5);
    let quoteIndex = 0;

    for (const folder of createdFolders) {
      const numQuotes = randomInt(5, 15);

      for (let pos = 0; pos < numQuotes && quoteIndex < shuffledQuotes.length; pos++) {
        await prisma.folderQuote.create({
          data: {
            folderId: folder.id,
            quoteId: shuffledQuotes[quoteIndex].id,
            addedById: user.id,
            position: pos,
            createdAt: randomDate(daysAgo(30), new Date()),
          },
        });
        quoteIndex++;
      }
    }

    // ── Create follows on public folders (simulate other users following) ──
    // We only have one user, so we create FolderFollow entries for the test user
    // on their own public folders to seed follower counts
    // In a real scenario these would be from other users
    const publicFolders = createdFolders.filter(
      (_, i) => FOLDERS[i].visibility === 'PUBLIC'
    );

    // ── Create invite links for some folders ────────────────────────────
    for (const folder of publicFolders.slice(0, 2)) {
      await prisma.folderInviteLink.create({
        data: {
          uuid: crypto.randomUUID(),
          folderId: folder.id,
          role: 'EDITOR',
          createdById: user.id,
        },
      });
    }

    // ── Create feed events ──────────────────────────────────────────────
    for (const folder of createdFolders) {
      const folderQuotes = await prisma.folderQuote.findMany({
        where: { folderId: folder.id },
        take: 3,
        orderBy: { createdAt: 'desc' },
      });

      for (const fq of folderQuotes) {
        await prisma.feedEvent.create({
          data: {
            type: 'quote_added_to_folder',
            actorId: user.id,
            folderId: folder.id,
            quoteId: fq.quoteId,
            createdAt: fq.createdAt,
          },
        });
      }
    }

    const totalQuotesInFolders = await prisma.folderQuote.count();
    const totalFeedEvents = await prisma.feedEvent.count();

    console.log(`  ✓ Folders seeded for test@gmail.com:`);
    console.log(`    ${createdFolders.length} folders`);
    console.log(`    ${totalQuotesInFolders} quotes in folders`);
    console.log(`    ${publicFolders.length} public, ${createdFolders.length - publicFolders.length} private`);
    console.log(`    2 invite links`);
    console.log(`    ${totalFeedEvents} feed events`);
  }
}

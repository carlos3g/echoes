import type { Prisma } from '../../generated/prisma/client';
import { UserFactory } from '../factories/user.factory';

const userFactory = new UserFactory();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const EXTRA_USERS = [
  {
    username: 'marcela',
    name: 'Marcela Oliveira',
    email: 'marcela@example.com',
    bio: 'Leitora compulsiva. Filosofia e café todas as manhãs.',
  },
  {
    username: 'rafael',
    name: 'Rafael Costa',
    email: 'rafael@example.com',
    bio: 'Engenheiro de software e estoico de fim de semana.',
  },
  {
    username: 'ana.luz',
    name: 'Ana Luz',
    email: 'ana.luz@example.com',
    bio: 'Professora de literatura. Palavras mudam mundos.',
  },
  {
    username: 'pedro.h',
    name: 'Pedro Henrique',
    email: 'pedro.h@example.com',
    bio: null,
  },
  {
    username: 'juliana',
    name: 'Juliana Santos',
    email: 'juliana@example.com',
    bio: 'Design e poesia. Curadora de citações bonitas.',
  },
  {
    username: 'lucas.dev',
    name: 'Lucas Almeida',
    email: 'lucas.dev@example.com',
    bio: 'Minimalista. Menos é mais.',
  },
  {
    username: 'camila.r',
    name: 'Camila Ribeiro',
    email: 'camila.r@example.com',
    bio: 'Psicóloga. Acredito no poder das palavras certas no momento certo.',
  },
  {
    username: 'thiago',
    name: 'Thiago Mendes',
    email: 'thiago@example.com',
    bio: 'Escritor. Colecionando frases desde 2015.',
  },
];

const OTHER_FOLDERS = [
  {
    username: 'marcela',
    folders: [
      { name: 'Café & Filosofia', description: 'Leituras matinais', visibility: 'PUBLIC' as const, color: '#C4796B' },
      { name: 'Feminismo', description: 'Vozes que importam', visibility: 'PUBLIC' as const, color: '#C9B1D0' },
      { name: 'Rascunhos', description: null, visibility: 'PRIVATE' as const, color: '#7B8FA1' },
    ],
  },
  {
    username: 'rafael',
    folders: [
      { name: 'Estoicismo Puro', description: 'Sêneca, Marco Aurélio, Epicteto', visibility: 'PUBLIC' as const, color: '#8B9E81' },
      { name: 'Programação & Vida', description: 'Sabedoria tech', visibility: 'PUBLIC' as const, color: '#E8C07D' },
    ],
  },
  {
    username: 'ana.luz',
    folders: [
      { name: 'Poesia em Prosa', description: 'Quando a citação é poesia', visibility: 'PUBLIC' as const, color: '#D4A574' },
      { name: 'Para Aulas', description: 'Material para discussão em sala', visibility: 'PUBLIC' as const, color: '#6B8E7B' },
      { name: 'Favoritas Pessoais', description: null, visibility: 'PRIVATE' as const, color: '#C4796B' },
    ],
  },
  {
    username: 'juliana',
    folders: [
      { name: 'Design & Criatividade', description: 'Inspiração criativa', visibility: 'PUBLIC' as const, color: '#E8C07D' },
      { name: 'Citações Bonitas', description: 'Curadoria estética', visibility: 'PUBLIC' as const, color: '#C9B1D0' },
    ],
  },
  {
    username: 'thiago',
    folders: [
      { name: 'Para o Livro', description: 'Epígrafes e inspirações', visibility: 'PUBLIC' as const, color: '#7B8FA1' },
      { name: 'Clássicos', description: 'Os imortais da literatura', visibility: 'PUBLIC' as const, color: '#8B9E81' },
      { name: 'WIP', description: null, visibility: 'PRIVATE' as const, color: '#D4A574' },
    ],
  },
];

export class SocialSeeder {
  public static async run(prisma: Prisma.TransactionClient): Promise<void> {
    const testUser = await prisma.user.findFirst({ where: { email: 'test@gmail.com' } });
    if (!testUser) throw new Error('Test user not found — run UsersSeeder first');

    const quotes = await prisma.quote.findMany();
    if (quotes.length === 0) throw new Error('No quotes found — run QuotesSeeder first');

    // ── Create extra users ─────────────────────────────────────────────
    const createdUsers = [];

    for (const userData of EXTRA_USERS) {
      const user = await prisma.user.create({
        data: userFactory.make({
          email: userData.email,
          username: userData.username,
          name: userData.name,
          bio: userData.bio,
        }),
      });
      createdUsers.push(user);
    }

    const allUsers = [testUser, ...createdUsers];
    const usersByUsername = new Map(allUsers.map((u) => [u.username, u]));

    console.log(`  ✓ Social: ${createdUsers.length} extra users created`);

    // ── Create follows (social graph) ──────────────────────────────────
    // test user follows marcela, rafael, ana.luz, juliana
    const testFollowing = ['marcela', 'rafael', 'ana.luz', 'juliana'];
    for (const username of testFollowing) {
      const target = usersByUsername.get(username)!;
      await prisma.userFollow.create({
        data: {
          followerId: testUser.id,
          followingId: target.id,
          createdAt: randomDate(daysAgo(45), daysAgo(5)),
        },
      });
    }

    // marcela, rafael, ana.luz, juliana, thiago, camila.r follow test user
    const testFollowers = ['marcela', 'rafael', 'ana.luz', 'juliana', 'thiago', 'camila.r'];
    for (const username of testFollowers) {
      const follower = usersByUsername.get(username)!;
      await prisma.userFollow.create({
        data: {
          followerId: follower.id,
          followingId: testUser.id,
          createdAt: randomDate(daysAgo(40), daysAgo(2)),
        },
      });
    }

    // Cross-follows between other users for realistic graph
    const crossFollows: [string, string][] = [
      ['marcela', 'rafael'],
      ['marcela', 'ana.luz'],
      ['marcela', 'juliana'],
      ['marcela', 'thiago'],
      ['rafael', 'marcela'],
      ['rafael', 'thiago'],
      ['rafael', 'lucas.dev'],
      ['ana.luz', 'marcela'],
      ['ana.luz', 'juliana'],
      ['ana.luz', 'thiago'],
      ['ana.luz', 'camila.r'],
      ['juliana', 'marcela'],
      ['juliana', 'ana.luz'],
      ['juliana', 'thiago'],
      ['thiago', 'marcela'],
      ['thiago', 'ana.luz'],
      ['thiago', 'rafael'],
      ['thiago', 'juliana'],
      ['camila.r', 'ana.luz'],
      ['camila.r', 'marcela'],
      ['camila.r', 'thiago'],
      ['lucas.dev', 'rafael'],
      ['lucas.dev', 'thiago'],
      ['pedro.h', 'rafael'],
      ['pedro.h', 'marcela'],
    ];

    for (const [followerUsername, followingUsername] of crossFollows) {
      const follower = usersByUsername.get(followerUsername)!;
      const following = usersByUsername.get(followingUsername)!;
      await prisma.userFollow.create({
        data: {
          followerId: follower.id,
          followingId: following.id,
          createdAt: randomDate(daysAgo(60), daysAgo(1)),
        },
      });
    }

    const totalFollows = await prisma.userFollow.count();
    console.log(`  ✓ Social: ${totalFollows} follow relationships created`);

    // ── Create folders for other users ─────────────────────────────────
    const allCreatedFolders = [];

    for (const { username, folders } of OTHER_FOLDERS) {
      const user = usersByUsername.get(username)!;

      for (let i = 0; i < folders.length; i++) {
        const f = folders[i];
        const folder = await prisma.folder.create({
          data: {
            uuid: crypto.randomUUID(),
            name: f.name,
            description: f.description,
            color: f.color,
            visibility: f.visibility,
            position: i,
            userId: user.id,
            createdAt: randomDate(daysAgo(50), daysAgo(10)),
          },
        });

        await prisma.folderMember.create({
          data: { folderId: folder.id, userId: user.id, role: 'OWNER' },
        });

        // Add quotes to folder
        const numQuotes = randomInt(4, 12);
        const folderQuotes = pickN(quotes, numQuotes);
        for (let pos = 0; pos < folderQuotes.length; pos++) {
          await prisma.folderQuote.create({
            data: {
              folderId: folder.id,
              quoteId: folderQuotes[pos].id,
              addedById: user.id,
              position: pos,
              createdAt: randomDate(daysAgo(30), new Date()),
            },
          });
        }

        allCreatedFolders.push({ folder, username });
      }
    }

    console.log(`  ✓ Social: ${allCreatedFolders.length} folders created for other users`);

    // ── Folder follows (users following other users' public folders) ───
    const publicFolders = allCreatedFolders.filter(
      (f) => OTHER_FOLDERS.flatMap((o) => o.folders).find(
        (of) => of.name === f.folder.name
      )?.visibility === 'PUBLIC'
    );

    // Test user follows some public folders from other users
    const foldersToFollow = pickN(publicFolders, 4);
    for (const { folder } of foldersToFollow) {
      await prisma.folderFollow.create({
        data: {
          folderId: folder.id,
          userId: testUser.id,
          createdAt: randomDate(daysAgo(20), daysAgo(1)),
        },
      });
    }

    // Other users follow each other's public folders
    for (const { folder, username: ownerUsername } of publicFolders) {
      const numFollowers = randomInt(1, 4);
      const potentialFollowers = allUsers.filter((u) => u.username !== ownerUsername);
      const followers = pickN(potentialFollowers, numFollowers);

      for (const follower of followers) {
        // Skip if test user already follows this folder
        if (follower.id === testUser.id && foldersToFollow.some((f) => f.folder.id === folder.id)) continue;

        try {
          await prisma.folderFollow.create({
            data: {
              folderId: folder.id,
              userId: follower.id,
              createdAt: randomDate(daysAgo(30), new Date()),
            },
          });
        } catch {
          // Skip duplicates
        }
      }
    }

    const totalFolderFollows = await prisma.folderFollow.count();
    console.log(`  ✓ Social: ${totalFolderFollows} folder follows`);

    // ── Saved folders (test user saves some public folders) ──��─────────
    const foldersToSave = pickN(
      publicFolders.filter((f) => !foldersToFollow.some((ft) => ft.folder.id === f.folder.id)),
      3
    );

    for (const { folder } of foldersToSave) {
      await prisma.savedFolder.create({
        data: {
          userId: testUser.id,
          folderId: folder.id,
          createdAt: randomDate(daysAgo(15), daysAgo(1)),
        },
      });
    }

    // Some other users also save folders
    for (const user of createdUsers.slice(0, 4)) {
      const saveable = pickN(
        publicFolders.filter((f) => f.username !== user.username),
        randomInt(1, 3)
      );
      for (const { folder } of saveable) {
        try {
          await prisma.savedFolder.create({
            data: {
              userId: user.id,
              folderId: folder.id,
              createdAt: randomDate(daysAgo(20), new Date()),
            },
          });
        } catch {
          // Skip duplicates
        }
      }
    }

    const totalSavedFolders = await prisma.savedFolder.count();
    console.log(`  ✓ Social: ${totalSavedFolders} saved folders`);

    // ── Add bio to test user ───────────────────────────────────────────
    await prisma.user.update({
      where: { id: testUser.id },
      data: { bio: 'Colecionando sabedoria, uma citação por vez.' },
    });

    console.log(`  ✓ Social seeding complete`);
  }
}

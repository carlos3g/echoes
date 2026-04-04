import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@generated/prisma/client';

const TABLE_NAMES = [
  'users',
  'password_change_request',
  'email_confirmation_token',
  'quotes',
  'user_favorite_quotes',
  'user_favorite_authors',
  'tag_quotes',
  'tag_authors',
  'sources',
  'categories',
  'authors',
  'tags',
  'files',
];

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public constructor() {
    const connectionString = process.env.DB_URL!;
    const schema = new URL(connectionString).searchParams.get('schema') || undefined;
    const adapter = new PrismaPg(connectionString, { schema });
    super({ adapter });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // see: https://github.com/prisma/docs/issues/451#issuecomment-713136121
  public async clearDatabase() {
    const tablesSeparatedByComma = TABLE_NAMES.join(',');

    // see: https://stackoverflow.com/a/39693913/13274020
    return this.$executeRawUnsafe(`TRUNCATE TABLE ${tablesSeparatedByComma} CASCADE;`);
  }
}

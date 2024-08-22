import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  public constructor() {
    super();
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // see: https://github.com/prisma/docs/issues/451#issuecomment-713136121
  public async clearDatabase() {
    const modelKeys = Prisma.dmmf.datamodel.models.map((model) => model.dbName);

    return Promise.all(modelKeys.map((table) => this.$executeRawUnsafe(`DELETE FROM ${table};`)));
  }
}

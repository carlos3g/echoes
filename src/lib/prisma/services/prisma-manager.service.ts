import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import { ClsService } from 'nestjs-cls';

export const PRISMA_CLIENT_KEY = 'prisma';

@Injectable()
export class PrismaManagerService {
  public constructor(
    private readonly cls: ClsService,
    private readonly prisma: PrismaService
  ) {}

  private getTransaction(): PrismaClient | null {
    return this.cls.get(PRISMA_CLIENT_KEY);
  }

  public getClient(): PrismaClient {
    return this.getTransaction() || this.prisma;
  }

  public getNativeClient(): PrismaClient {
    return this.prisma;
  }
}

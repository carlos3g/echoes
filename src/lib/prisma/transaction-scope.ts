import type { TransactionScope } from '@app/lib/prisma/interfaces/transaction-scope.interface';
import { PRISMA_CLIENT_KEY, PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PrismaTransactionScope implements TransactionScope {
  private readonly logger = new Logger(PrismaTransactionScope.name);

  public constructor(
    private readonly prisma: PrismaManagerService,
    private readonly cls: ClsService
  ) {}

  public async run<T = Array<unknown>>(fn: () => Promise<T>): Promise<T> {
    return this.prisma.getNativeClient().$transaction(async (prisma) => {
      const callback = async () => {
        this.cls.set(PRISMA_CLIENT_KEY, prisma);

        try {
          return await fn();
        } catch (err) {
          this.logger.error(err);
          throw err;
        } finally {
          this.cls.set(PRISMA_CLIENT_KEY, undefined);
        }
      };

      return this.cls.run(callback);
    });
  }
}

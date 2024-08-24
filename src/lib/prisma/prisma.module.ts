import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import { PrismaTransactionScopeService } from '@app/lib/prisma/services/transaction-scope.service';
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
      },
    }),
  ],
  providers: [PrismaManagerService, PrismaService, PrismaTransactionScopeService],
  exports: [PrismaManagerService, PrismaService, PrismaTransactionScopeService],
})
export class PrismaModule {}

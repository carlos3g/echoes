import { PrismaManagerService } from '@app/lib/prisma/services/prisma-manager.service';
import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import { PrismaTransactionScope } from '@app/lib/prisma/transaction-scope';
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
  providers: [PrismaManagerService, PrismaService, PrismaTransactionScope],
  exports: [PrismaManagerService, PrismaService, PrismaTransactionScope],
})
export class PrismaModule {}

import '@app/lib/prisma/helpers/big-int-polyfill';

import { AuthorModule } from '@app/author/author.module';
import { CategoryModule } from '@app/category/category.module';
import { HealthModule } from '@app/health/health.module';
import { PrismaClientExceptionFilter } from '@app/lib/prisma/exceptions/prisma-client-exception.filter';
import { PrismaService } from '@app/lib/prisma/services/prisma.service';
import { QuoteModule } from '@app/quote/quote.module';
import { SourceModule } from '@app/source/source.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HealthModule,
    AuthorModule,
    QuoteModule,
    UserModule,
    CategoryModule,
    SourceModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter,
    },
  ],
})
export class AppModule {}

import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { PrismaUserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { PrismaUserRepository } from '@app/user/repositories/prisma-user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: PrismaUserRepositoryContract,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    {
      provide: PrismaUserRepositoryContract,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}

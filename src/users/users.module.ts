import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { UserRepositoryContract } from '@app/users/contracts';
import { UserRepository } from '@app/users/repositories/user.repository';
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepositoryContract,
      useClass: UserRepository,
    },
  ],
  exports: [UserRepositoryContract],
})
export class UsersModule {}

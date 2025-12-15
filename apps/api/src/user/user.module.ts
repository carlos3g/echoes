import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { StorageModule } from '@app/storage/storage.module';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { PrismaUserRepository } from '@app/user/repositories/prisma-user.repository';
import { GetUserAvatarUseCase } from '@app/user/use-cases/get-user-avatar.use-case';
import { UserController } from '@app/user/user.controller';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), StorageModule],
  providers: [
    {
      provide: UserRepositoryContract,
      useClass: PrismaUserRepository,
    },
    UserService,
    GetUserAvatarUseCase,
  ],
  exports: [UserRepositoryContract, UserService],
  controllers: [UserController],
})
export class UserModule {}

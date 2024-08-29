import { AuthModule } from '@app/auth/auth.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { PrismaUserRepository } from '@app/user/repositories/prisma-user.repository';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [
    UserService,
    {
      provide: UserRepositoryContract,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepositoryContract, UserService],
})
export class UserModule {}

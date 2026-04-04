import { AuthModule } from '@app/auth/auth.module';
import { FolderModule } from '@app/folder/folder.module';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { StorageModule } from '@app/storage/storage.module';
import { SavedFolderRepositoryContract } from '@app/user/contracts/saved-folder-repository.contract';
import { UserFollowRepositoryContract } from '@app/user/contracts/user-follow-repository.contract';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { PrismaSavedFolderRepository } from '@app/user/repositories/prisma-saved-folder.repository';
import { PrismaUserFollowRepository } from '@app/user/repositories/prisma-user-follow.repository';
import { PrismaUserRepository } from '@app/user/repositories/prisma-user.repository';
import { UserService } from '@app/user/services/user.service';
import { FollowUserUseCase } from '@app/user/use-cases/follow-user.use-case';
import { GetUserAvatarUseCase } from '@app/user/use-cases/get-user-avatar.use-case';
import { GetUserProfileUseCase } from '@app/user/use-cases/get-user-profile.use-case';
import { ListFollowersUseCase } from '@app/user/use-cases/list-followers.use-case';
import { ListFollowingUseCase } from '@app/user/use-cases/list-following.use-case';
import { SaveFolderUseCase } from '@app/user/use-cases/save-folder.use-case';
import { SearchUsersUseCase } from '@app/user/use-cases/search-users.use-case';
import { SuggestedUsersUseCase } from '@app/user/use-cases/suggested-users.use-case';
import { UnfollowUserUseCase } from '@app/user/use-cases/unfollow-user.use-case';
import { UnsaveFolderUseCase } from '@app/user/use-cases/unsave-folder.use-case';
import { UserController } from '@app/user/user.controller';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), StorageModule, forwardRef(() => FolderModule)],
  providers: [
    {
      provide: UserRepositoryContract,
      useClass: PrismaUserRepository,
    },
    {
      provide: UserFollowRepositoryContract,
      useClass: PrismaUserFollowRepository,
    },
    {
      provide: SavedFolderRepositoryContract,
      useClass: PrismaSavedFolderRepository,
    },
    UserService,
    GetUserAvatarUseCase,
    GetUserProfileUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    ListFollowersUseCase,
    ListFollowingUseCase,
    SaveFolderUseCase,
    UnsaveFolderUseCase,
    SearchUsersUseCase,
    SuggestedUsersUseCase,
  ],
  exports: [UserRepositoryContract, UserService, SavedFolderRepositoryContract],
  controllers: [UserController],
})
export class UserModule {}

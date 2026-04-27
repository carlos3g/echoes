import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { QuoteModule } from '@app/quote/quote.module';
import { UserModule } from '@app/user/user.module';
import { FolderRepositoryContract } from '@app/folder/contracts/folder-repository.contract';
import { FolderMemberRepositoryContract } from '@app/folder/contracts/folder-member-repository.contract';
import { FolderQuoteRepositoryContract } from '@app/folder/contracts/folder-quote-repository.contract';
import { FolderFollowRepositoryContract } from '@app/folder/contracts/folder-follow-repository.contract';
import { FolderInviteLinkRepositoryContract } from '@app/folder/contracts/folder-invite-link-repository.contract';
import { PrismaFolderRepository } from '@app/folder/repositories/prisma-folder.repository';
import { PrismaFolderMemberRepository } from '@app/folder/repositories/prisma-folder-member.repository';
import { PrismaFolderQuoteRepository } from '@app/folder/repositories/prisma-folder-quote.repository';
import { PrismaFolderFollowRepository } from '@app/folder/repositories/prisma-folder-follow.repository';
import { PrismaFolderInviteLinkRepository } from '@app/folder/repositories/prisma-folder-invite-link.repository';
import { FolderService } from '@app/folder/services/folder.service';
import { FolderAuthorizationService } from '@app/folder/services/folder-authorization.service';
import { FolderController } from '@app/folder/folder.controller';
import { CreateFolderUseCase } from '@app/folder/use-cases/create-folder.use-case';
import { UpdateFolderUseCase } from '@app/folder/use-cases/update-folder.use-case';
import { DeleteFolderUseCase } from '@app/folder/use-cases/delete-folder.use-case';
import { GetFolderUseCase } from '@app/folder/use-cases/get-folder.use-case';
import { ListUserFoldersUseCase } from '@app/folder/use-cases/list-user-folders.use-case';
import { AddQuoteToFolderUseCase } from '@app/folder/use-cases/add-quote-to-folder.use-case';
import { RemoveQuoteFromFolderUseCase } from '@app/folder/use-cases/remove-quote-from-folder.use-case';
import { ListFolderQuotesUseCase } from '@app/folder/use-cases/list-folder-quotes.use-case';
import { ReorderFolderQuotesUseCase } from '@app/folder/use-cases/reorder-folder-quotes.use-case';
import { ReorderFoldersUseCase } from '@app/folder/use-cases/reorder-folders.use-case';
import { ToggleFolderVisibilityUseCase } from '@app/folder/use-cases/toggle-folder-visibility.use-case';
import { ListFolderMembersUseCase } from '@app/folder/use-cases/list-folder-members.use-case';
import { UpdateMemberRoleUseCase } from '@app/folder/use-cases/update-member-role.use-case';
import { RemoveMemberUseCase } from '@app/folder/use-cases/remove-member.use-case';
import { LeaveFolderUseCase } from '@app/folder/use-cases/leave-folder.use-case';
import { CreateInviteLinkUseCase } from '@app/folder/use-cases/create-invite-link.use-case';
import { AcceptInviteUseCase } from '@app/folder/use-cases/accept-invite.use-case';
import { InviteByUsernameUseCase } from '@app/folder/use-cases/invite-by-username.use-case';
import { FollowFolderUseCase } from '@app/folder/use-cases/follow-folder.use-case';
import { UnfollowFolderUseCase } from '@app/folder/use-cases/unfollow-folder.use-case';
import { ListFolderFollowersUseCase } from '@app/folder/use-cases/list-folder-followers.use-case';
import { SearchFoldersUseCase } from '@app/folder/use-cases/search-folders.use-case';
import { PopularFoldersUseCase } from '@app/folder/use-cases/popular-folders.use-case';
import { ListUserPublicFoldersUseCase } from '@app/folder/use-cases/list-user-public-folders.use-case';
import { ActivityModule } from '@app/activity/activity.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, QuoteModule, forwardRef(() => UserModule), ActivityModule],
  controllers: [FolderController],
  providers: [
    {
      provide: FolderRepositoryContract,
      useClass: PrismaFolderRepository,
    },
    {
      provide: FolderMemberRepositoryContract,
      useClass: PrismaFolderMemberRepository,
    },
    {
      provide: FolderQuoteRepositoryContract,
      useClass: PrismaFolderQuoteRepository,
    },
    {
      provide: FolderFollowRepositoryContract,
      useClass: PrismaFolderFollowRepository,
    },
    {
      provide: FolderInviteLinkRepositoryContract,
      useClass: PrismaFolderInviteLinkRepository,
    },
    FolderService,
    FolderAuthorizationService,
    CreateFolderUseCase,
    UpdateFolderUseCase,
    DeleteFolderUseCase,
    GetFolderUseCase,
    ListUserFoldersUseCase,
    AddQuoteToFolderUseCase,
    RemoveQuoteFromFolderUseCase,
    ListFolderQuotesUseCase,
    ReorderFolderQuotesUseCase,
    ReorderFoldersUseCase,
    ToggleFolderVisibilityUseCase,
    ListFolderMembersUseCase,
    UpdateMemberRoleUseCase,
    RemoveMemberUseCase,
    LeaveFolderUseCase,
    CreateInviteLinkUseCase,
    AcceptInviteUseCase,
    InviteByUsernameUseCase,
    FollowFolderUseCase,
    UnfollowFolderUseCase,
    ListFolderFollowersUseCase,
    SearchFoldersUseCase,
    PopularFoldersUseCase,
    ListUserPublicFoldersUseCase,
  ],
  exports: [FolderRepositoryContract, FolderMemberRepositoryContract],
})
export class FolderModule {}

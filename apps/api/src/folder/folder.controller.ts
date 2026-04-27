import { Public } from '@app/auth/decorators/public.decorator';
import { UserDecorator } from '@app/auth/decorators/user.decorator';
import { AddQuoteToFolderRequest } from '@app/folder/dtos/add-quote-to-folder-request';
import { CreateFolderRequest } from '@app/folder/dtos/create-folder-request';
import { CreateInviteLinkRequest } from '@app/folder/dtos/create-invite-link-request';
import { FolderPaginatedQuery } from '@app/folder/dtos/folder-paginated-query';
import { InviteMemberByUsernameRequest } from '@app/folder/dtos/invite-member-request';
import { ReorderFolderQuotesRequest } from '@app/folder/dtos/reorder-folder-quotes-request';
import { ReorderFoldersRequest } from '@app/folder/dtos/reorder-folders-request';
import { ToggleFolderVisibilityRequest } from '@app/folder/dtos/toggle-folder-visibility-request';
import { UpdateFolderRequest } from '@app/folder/dtos/update-folder-request';
import { UpdateMemberRoleRequest } from '@app/folder/dtos/update-member-role-request';
import { SearchFoldersQuery } from '@app/folder/dtos/search-folders-query';
import { AcceptInviteUseCase } from '@app/folder/use-cases/accept-invite.use-case';
import { SearchFoldersUseCase } from '@app/folder/use-cases/search-folders.use-case';
import { PopularFoldersUseCase } from '@app/folder/use-cases/popular-folders.use-case';
import { ListUserPublicFoldersUseCase } from '@app/folder/use-cases/list-user-public-folders.use-case';
import { FollowFolderUseCase } from '@app/folder/use-cases/follow-folder.use-case';
import { UnfollowFolderUseCase } from '@app/folder/use-cases/unfollow-folder.use-case';
import { ListFolderFollowersUseCase } from '@app/folder/use-cases/list-folder-followers.use-case';
import { AddQuoteToFolderUseCase } from '@app/folder/use-cases/add-quote-to-folder.use-case';
import { CreateFolderUseCase } from '@app/folder/use-cases/create-folder.use-case';
import { CreateInviteLinkUseCase } from '@app/folder/use-cases/create-invite-link.use-case';
import { DeleteFolderUseCase } from '@app/folder/use-cases/delete-folder.use-case';
import { GetFolderUseCase } from '@app/folder/use-cases/get-folder.use-case';
import { InviteByUsernameUseCase } from '@app/folder/use-cases/invite-by-username.use-case';
import { LeaveFolderUseCase } from '@app/folder/use-cases/leave-folder.use-case';
import { ListFolderMembersUseCase } from '@app/folder/use-cases/list-folder-members.use-case';
import { ListFolderQuotesUseCase } from '@app/folder/use-cases/list-folder-quotes.use-case';
import { ListUserFoldersUseCase } from '@app/folder/use-cases/list-user-folders.use-case';
import { RemoveMemberUseCase } from '@app/folder/use-cases/remove-member.use-case';
import { RemoveQuoteFromFolderUseCase } from '@app/folder/use-cases/remove-quote-from-folder.use-case';
import { ReorderFolderQuotesUseCase } from '@app/folder/use-cases/reorder-folder-quotes.use-case';
import { ReorderFoldersUseCase } from '@app/folder/use-cases/reorder-folders.use-case';
import { ToggleFolderVisibilityUseCase } from '@app/folder/use-cases/toggle-folder-visibility.use-case';
import { UpdateFolderUseCase } from '@app/folder/use-cases/update-folder.use-case';
import { UpdateMemberRoleUseCase } from '@app/folder/use-cases/update-member-role.use-case';
import { Paginate } from '@app/shared/dtos/paginate';
import { User } from '@app/user/entities/user.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller({ path: 'folders', version: '1' })
export class FolderController {
  public constructor(
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly getFolderUseCase: GetFolderUseCase,
    private readonly listUserFoldersUseCase: ListUserFoldersUseCase,
    private readonly addQuoteToFolderUseCase: AddQuoteToFolderUseCase,
    private readonly removeQuoteFromFolderUseCase: RemoveQuoteFromFolderUseCase,
    private readonly listFolderQuotesUseCase: ListFolderQuotesUseCase,
    private readonly reorderFolderQuotesUseCase: ReorderFolderQuotesUseCase,
    private readonly reorderFoldersUseCase: ReorderFoldersUseCase,
    private readonly toggleFolderVisibilityUseCase: ToggleFolderVisibilityUseCase,
    private readonly listFolderMembersUseCase: ListFolderMembersUseCase,
    private readonly updateMemberRoleUseCase: UpdateMemberRoleUseCase,
    private readonly removeMemberUseCase: RemoveMemberUseCase,
    private readonly leaveFolderUseCase: LeaveFolderUseCase,
    private readonly createInviteLinkUseCase: CreateInviteLinkUseCase,
    private readonly acceptInviteUseCase: AcceptInviteUseCase,
    private readonly inviteByUsernameUseCase: InviteByUsernameUseCase,
    private readonly followFolderUseCase: FollowFolderUseCase,
    private readonly unfollowFolderUseCase: UnfollowFolderUseCase,
    private readonly listFolderFollowersUseCase: ListFolderFollowersUseCase,
    private readonly searchFoldersUseCase: SearchFoldersUseCase,
    private readonly popularFoldersUseCase: PopularFoldersUseCase,
    private readonly listUserPublicFoldersUseCase: ListUserPublicFoldersUseCase
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Query() params: FolderPaginatedQuery, @UserDecorator() user: User) {
    return this.listUserFoldersUseCase.handle({ ...params, user });
  }

  @Public()
  @Get('search')
  @HttpCode(HttpStatus.OK)
  public async search(@Query() params: SearchFoldersQuery, @UserDecorator() user?: User) {
    return this.searchFoldersUseCase.handle({ query: params.q, paginate: params.paginate, user });
  }

  @Public()
  @Get('popular')
  @HttpCode(HttpStatus.OK)
  public async popular(@Query() params: FolderPaginatedQuery, @UserDecorator() user?: User) {
    return this.popularFoldersUseCase.handle({ paginate: params.paginate, user });
  }

  @Public()
  @Get('user/:username')
  @HttpCode(HttpStatus.OK)
  public async listUserPublicFolders(@Param('username') username: string, @Query() params: Paginate) {
    return this.listUserPublicFoldersUseCase.handle({ username, paginate: params });
  }

  @Public()
  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  public async show(@Param('uuid') uuid: string, @UserDecorator() user?: User) {
    return this.getFolderUseCase.handle({ uuid, user });
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@UserDecorator() user: User, @Body() input: CreateFolderRequest) {
    return this.createFolderUseCase.handle({ user, ...input });
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async reorderFolders(@UserDecorator() user: User, @Body() input: ReorderFoldersRequest) {
    return this.reorderFoldersUseCase.handle({ user, ...input });
  }

  @Patch(':uuid')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('uuid') uuid: string, @UserDecorator() user: User, @Body() input: UpdateFolderRequest) {
    return this.updateFolderUseCase.handle({ uuid, user, ...input });
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('uuid') uuid: string, @UserDecorator() user: User) {
    return this.deleteFolderUseCase.handle({ uuid, user });
  }

  @Patch(':uuid/visibility')
  @HttpCode(HttpStatus.OK)
  public async toggleVisibility(
    @Param('uuid') uuid: string,
    @UserDecorator() user: User,
    @Body() input: ToggleFolderVisibilityRequest
  ) {
    return this.toggleFolderVisibilityUseCase.handle({ uuid, user, ...input });
  }

  @Public()
  @Get(':uuid/quotes')
  @HttpCode(HttpStatus.OK)
  public async listQuotes(@Param('uuid') folderUuid: string, @Query() params: Paginate, @UserDecorator() user?: User) {
    return this.listFolderQuotesUseCase.handle({ folderUuid, user, paginate: params });
  }

  @Post(':uuid/quotes')
  @HttpCode(HttpStatus.CREATED)
  public async addQuote(
    @Param('uuid') folderUuid: string,
    @UserDecorator() user: User,
    @Body() input: AddQuoteToFolderRequest
  ) {
    return this.addQuoteToFolderUseCase.handle({ folderUuid, user, ...input });
  }

  @Delete(':uuid/quotes/:quoteUuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeQuote(
    @Param('uuid') folderUuid: string,
    @Param('quoteUuid') quoteUuid: string,
    @UserDecorator() user: User
  ) {
    return this.removeQuoteFromFolderUseCase.handle({ folderUuid, quoteUuid, user });
  }

  @Patch(':uuid/quotes/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async reorderQuotes(
    @Param('uuid') folderUuid: string,
    @UserDecorator() user: User,
    @Body() input: ReorderFolderQuotesRequest
  ) {
    return this.reorderFolderQuotesUseCase.handle({ folderUuid, user, ...input });
  }

  @Get(':uuid/members')
  @HttpCode(HttpStatus.OK)
  public async listMembers(@Param('uuid') folderUuid: string, @UserDecorator() user: User) {
    return this.listFolderMembersUseCase.handle({ folderUuid, user });
  }

  @Post(':uuid/invite')
  @HttpCode(HttpStatus.CREATED)
  public async inviteByUsername(
    @Param('uuid') folderUuid: string,
    @UserDecorator() user: User,
    @Body() input: InviteMemberByUsernameRequest
  ) {
    return this.inviteByUsernameUseCase.handle({ folderUuid, user, ...input });
  }

  @Post(':uuid/invite-links')
  @HttpCode(HttpStatus.CREATED)
  public async createInviteLink(
    @Param('uuid') folderUuid: string,
    @UserDecorator() user: User,
    @Body() input: CreateInviteLinkRequest
  ) {
    return this.createInviteLinkUseCase.handle({ folderUuid, user, ...input });
  }

  @Post('accept-invite/:linkUuid')
  @HttpCode(HttpStatus.OK)
  public async acceptInvite(@Param('linkUuid') linkUuid: string, @UserDecorator() user: User) {
    return this.acceptInviteUseCase.handle({ linkUuid, user });
  }

  @Patch(':uuid/members/:userUuid/role')
  @HttpCode(HttpStatus.OK)
  public async updateMemberRole(
    @Param('uuid') folderUuid: string,
    @Param('userUuid') userUuid: string,
    @UserDecorator() user: User,
    @Body() input: UpdateMemberRoleRequest
  ) {
    return this.updateMemberRoleUseCase.handle({ folderUuid, memberUserUuid: userUuid, user, ...input });
  }

  @Delete(':uuid/members/:userUuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeMember(
    @Param('uuid') folderUuid: string,
    @Param('userUuid') userUuid: string,
    @UserDecorator() user: User
  ) {
    return this.removeMemberUseCase.handle({ folderUuid, memberUserUuid: userUuid, user });
  }

  @Post(':uuid/leave')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async leaveFolder(@Param('uuid') folderUuid: string, @UserDecorator() user: User) {
    return this.leaveFolderUseCase.handle({ folderUuid, user });
  }

  @Post(':uuid/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async follow(@Param('uuid') folderUuid: string, @UserDecorator() user: User) {
    return this.followFolderUseCase.handle({ folderUuid, user });
  }

  @Post(':uuid/unfollow')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async unfollow(@Param('uuid') folderUuid: string, @UserDecorator() user: User) {
    return this.unfollowFolderUseCase.handle({ folderUuid, user });
  }

  @Public()
  @Get(':uuid/followers')
  @HttpCode(HttpStatus.OK)
  public async listFollowers(@Param('uuid') folderUuid: string, @Query() params: Paginate) {
    return this.listFolderFollowersUseCase.handle({ folderUuid, paginate: params });
  }
}

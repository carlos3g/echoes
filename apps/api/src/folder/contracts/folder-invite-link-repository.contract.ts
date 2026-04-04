import type {
  FolderInviteLinkRepositoryCreateInput,
  FolderInviteLinkRepositoryFindUniqueOrThrowInput,
  FolderInviteLinkRepositoryIncrementUsedCountInput,
} from '@app/folder/dtos/folder-invite-link-repository-dtos';
import type { FolderInviteLink } from '@app/folder/entities/folder-invite-link.entity';

abstract class FolderInviteLinkRepositoryContract {
  public abstract create(input: FolderInviteLinkRepositoryCreateInput): Promise<FolderInviteLink>;

  public abstract findUniqueOrThrow(input: FolderInviteLinkRepositoryFindUniqueOrThrowInput): Promise<FolderInviteLink>;

  public abstract incrementUsedCount(input: FolderInviteLinkRepositoryIncrementUsedCountInput): Promise<void>;
}

export { FolderInviteLinkRepositoryContract };

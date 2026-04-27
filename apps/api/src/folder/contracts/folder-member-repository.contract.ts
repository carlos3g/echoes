import type {
  FolderMemberRepositoryCreateInput,
  FolderMemberRepositoryDeleteInput,
  FolderMemberRepositoryFindInput,
  FolderMemberRepositoryFindManyInput,
  FolderMemberRepositoryUpdateInput,
} from '@app/folder/dtos/folder-member-repository-dtos';
import type { FolderMember } from '@app/folder/entities/folder-member.entity';

abstract class FolderMemberRepositoryContract {
  public abstract create(input: FolderMemberRepositoryCreateInput): Promise<FolderMember>;

  public abstract find(input: FolderMemberRepositoryFindInput): Promise<FolderMember | null>;

  public abstract findMany(input: FolderMemberRepositoryFindManyInput): Promise<FolderMember[]>;

  public abstract findManyWithUser(input: FolderMemberRepositoryFindManyInput): Promise<FolderMember[]>;

  public abstract update(input: FolderMemberRepositoryUpdateInput): Promise<FolderMember>;

  public abstract delete(input: FolderMemberRepositoryDeleteInput): Promise<void>;
}

export { FolderMemberRepositoryContract };

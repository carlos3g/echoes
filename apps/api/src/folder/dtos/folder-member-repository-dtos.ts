export interface FolderMemberRepositoryCreateInput {
  folderId: number;
  userId: number;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface FolderMemberRepositoryFindInput {
  where: {
    folderId: number;
    userId: number;
  };
}

export interface FolderMemberRepositoryFindManyInput {
  where: {
    folderId?: number;
    userId?: number;
  };
}

export interface FolderMemberRepositoryUpdateInput {
  where: {
    folderId: number;
    userId: number;
  };
  data: {
    role: 'OWNER' | 'EDITOR' | 'VIEWER';
  };
}

export interface FolderMemberRepositoryDeleteInput {
  where: {
    folderId: number;
    userId: number;
  };
}

import { Exclude } from 'class-transformer';

export class FolderMember {
  public constructor(input: FolderMember) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  @Exclude()
  public folderId!: number;

  @Exclude()
  public userId!: number;

  public role!: 'OWNER' | 'EDITOR' | 'VIEWER';

  public user?: {
    uuid: string;
    name: string;
    username: string;
  };

  public createdAt!: Date;
}

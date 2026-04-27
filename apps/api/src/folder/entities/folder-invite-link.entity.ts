import { Exclude } from 'class-transformer';

export class FolderInviteLink {
  public constructor(input: FolderInviteLink) {
    Object.assign(this, input);
  }

  @Exclude()
  public id!: number;

  public uuid!: string;

  @Exclude()
  public folderId!: number;

  public role!: 'OWNER' | 'EDITOR' | 'VIEWER';

  @Exclude()
  public createdById!: number;

  public expiresAt!: Date | null;

  public maxUses!: number | null;

  public usedCount!: number;

  public createdAt!: Date;
}

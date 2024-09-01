export class EmailConfirmationToken {
  public constructor(input: EmailConfirmationToken) {
    Object.assign(this, input);
  }

  public token!: string;

  public userId!: number;

  public usedAt!: Date | null;

  public expiresAt!: Date;

  public createdAt!: Date;

  public updatedAt!: Date;
}

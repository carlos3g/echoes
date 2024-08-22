import { Exclude } from 'class-transformer';

export class User {
  @Exclude()
  public id!: number;

  public uuid!: string;

  public name!: string;

  public email!: string;

  public password!: string;

  public emailVerifiedAt!: Date | null;

  public createdAt!: Date;

  public updatedAt!: Date;
}

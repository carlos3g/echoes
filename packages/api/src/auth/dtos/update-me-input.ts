import type { User } from '@app/user/entities/user.entity';

export class UpdateMeInput {
  public name?: string;

  public email?: string;

  public user!: User;
}

import type { User } from '@app/user/entities/user.entity';

export class ConfirmEmailInput {
  public token!: string;

  public user!: User;
}

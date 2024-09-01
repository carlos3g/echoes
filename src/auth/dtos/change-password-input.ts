import type { User } from '@app/user/entities/user.entity';

export class ChangePasswordInput {
  public currentPassword!: string;

  public password!: string;

  public passwordConfirmation!: string;

  public user!: User;
}

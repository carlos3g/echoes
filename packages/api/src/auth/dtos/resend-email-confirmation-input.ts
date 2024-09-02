import type { User } from '@app/user/entities/user.entity';

export class ResendEmailConfirmationInput {
  public user!: User;
}

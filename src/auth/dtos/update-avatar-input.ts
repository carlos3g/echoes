import type { User } from '@app/user/entities/user.entity';

export class UpdateAvatarInput {
  public user!: User;

  public avatar!: Express.Multer.File;
}

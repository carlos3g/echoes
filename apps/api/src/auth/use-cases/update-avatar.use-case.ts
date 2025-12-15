import type { UpdateAvatarInput } from '@app/auth/dtos/update-avatar-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserService } from '@app/user/services/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdateAvatarUseCase implements UseCaseHandler {
  public constructor(private readonly userService: UserService) {}

  public async handle(input: UpdateAvatarInput): Promise<void> {
    const { avatar, user } = input;

    await this.userService.updateAvatar({ avatar, userId: user.id });
  }
}

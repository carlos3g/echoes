import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { GetUserAvatarInput } from '@app/user/dtos/get-user-avatar-input';
import { UserService } from '@app/user/services/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as jdenticon from 'jdenticon';

@Injectable()
export class GetUserAvatarUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly userService: UserService
  ) {}

  public async handle(input: GetUserAvatarInput): Promise<void> {
    const { userUuid, response } = input;

    const user = await this.userRepository.findUniqueOrThrow({
      where: {
        uuid: userUuid,
      },
    });

    const buffer = !user.avatarId ? this.getAvatarFallback(user.email) : await this.userService.getAvatar({ user });

    response.set({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'image/webp',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Length': buffer.length,
    });

    response.status(HttpStatus.OK).send(buffer);
  }

  private getAvatarFallback(value: string): Buffer {
    return jdenticon.toPng(value, 1080);
  }
}

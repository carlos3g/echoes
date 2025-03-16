import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import type { ChangePasswordInput } from '@app/auth/dtos/change-password-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserService } from '@app/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ChangePasswordUseCase implements UseCaseHandler {
  public constructor(
    private readonly userService: UserService,
    private readonly hashService: HashServiceContract
  ) {}

  public async handle(input: ChangePasswordInput): Promise<void> {
    const { user, passwordConfirmation: _, currentPassword: __, ...rest } = input;

    if (!this.hashService.compare(input.currentPassword, user.password)) {
      throw new UnauthorizedException('Invalid current password');
    }

    await this.userService.update({
      ...rest,
      userId: user.id,
    });
  }
}

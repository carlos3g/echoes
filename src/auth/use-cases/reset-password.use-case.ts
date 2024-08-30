import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type { ResetPasswordInput } from '@app/auth/dtos/reset-password-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserService } from '@app/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class ResetPasswordUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly userService: UserService,
    private readonly hashService: HashServiceContract,
    private readonly passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract
  ) {}

  public async handle(input: ResetPasswordInput): Promise<unknown> {
    const user = await this.userRepository.findUniqueOrThrow({
      where: {
        email: input.email,
      },
    });

    const passwordChangeRequest = await this.passwordChangeRequestRepository.findFirstValidOrThrow({
      where: {
        userId: user.id,
      },
    });

    if (!this.hashService.compare(input.token, passwordChangeRequest.token)) {
      throw new UnauthorizedException();
    }

    await this.passwordChangeRequestRepository.update({
      where: {
        token: passwordChangeRequest.token,
      },
      data: {
        usedAt: DateTime.now().toJSDate(),
      },
    });

    await this.userService.update({
      userId: user.id,
      password: input.password,
    });

    return null;
  }
}

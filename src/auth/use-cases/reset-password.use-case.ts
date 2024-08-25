import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type { ResetPasswordInput } from '@app/auth/dtos/reset-password-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ResetPasswordUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashService: HashServiceContract,
    private readonly passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract
  ) {}

  public async handle(input: ResetPasswordInput): Promise<unknown> {
    const user = await this.userRepository.findUniqueOrThrow({
      where: {
        email: input.email,
      },
    });

    const passwordChangeRequest = await this.passwordChangeRequestRepository.findFirstOrThrow({
      where: {
        userId: user.id,
      },
    });

    if (!this.hashService.compare(input.token, passwordChangeRequest.token)) {
      throw new UnauthorizedException();
    }

    await this.userRepository.update({
      where: {
        id: user.id,
      },
      data: {
        password: this.hashService.hash(input.password),
      },
    });

    return null;
  }
}

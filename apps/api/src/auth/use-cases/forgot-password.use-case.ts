import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type { ForgotPasswordInput } from '@app/auth/dtos/forgot-password-input';
import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { forgotPasswordTokenPreset } from '@app/email/presets';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ForgotPasswordUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract,
    private readonly emailService: EmailServiceContract,
    private readonly authService: AuthServiceContract
  ) {}

  public async handle(input: ForgotPasswordInput): Promise<unknown> {
    const user = await this.userRepository.findUniqueOrThrow({
      where: {
        email: input.email,
      },
    });

    await this.passwordChangeRequestRepository.deleteMany({
      where: { userId: user.id },
    });

    const { token } = await this.authService.createPasswordChangeRequest({ userId: user.id });

    void this.emailService.send(
      forgotPasswordTokenPreset({
        to: user.email,
        context: { token },
      })
    );

    return null;
  }
}

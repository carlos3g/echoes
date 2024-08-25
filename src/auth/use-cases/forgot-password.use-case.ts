import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type { ForgotPasswordInput } from '@app/auth/dtos/forgot-password-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { createUuidV4 } from '@app/shared/utils';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ForgotPasswordUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashService: HashServiceContract,
    private readonly passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract
  ) {}

  public async handle(input: ForgotPasswordInput): Promise<unknown> {
    const user = await this.userRepository.findUniqueOrThrow({
      where: {
        email: input.email,
      },
    });

    const token = createUuidV4();
    const hashedToken = this.hashService.hash(token);

    // TODO: send email
    // eslint-disable-next-line no-console
    console.log({ token });

    await this.passwordChangeRequestRepository.deleteMany({
      where: { userId: user.id },
    });

    await this.passwordChangeRequestRepository.create({
      userId: user.id,
      token: hashedToken,
    });

    return null;
  }
}

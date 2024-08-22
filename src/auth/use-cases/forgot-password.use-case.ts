import { HashServiceContract, PasswordChangeRequestRepositoryContract } from '@app/auth/contracts';
import type { ForgotPasswordInput } from '@app/auth/dtos/forgot-password-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/users/contracts';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

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

    const token = uuid();
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

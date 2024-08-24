import { AuthServiceContract, HashServiceContract } from '@app/auth/contracts';
import type { SignInInput } from '@app/auth/dtos/sign-in-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { PrismaUserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SignInUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: PrismaUserRepositoryContract,
    private readonly hashService: HashServiceContract,
    private readonly authService: AuthServiceContract
  ) {}

  public async handle(input: SignInInput): Promise<unknown> {
    const user = await this.userRepository.findUniqueOrThrow({
      where: {
        email: input.email,
      },
    });

    if (!this.hashService.compare(input.password, user.password)) {
      throw new UnauthorizedException();
    }

    return this.authService.generateAuthTokens(user);
  }
}

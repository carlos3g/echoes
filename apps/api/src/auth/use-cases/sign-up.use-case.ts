import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import type { SignUpInput } from '@app/auth/dtos/sign-up-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserService } from '@app/user/services/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUseCase implements UseCaseHandler {
  public constructor(
    private readonly userService: UserService,
    private readonly authService: AuthServiceContract
  ) {}

  public async handle(input: SignUpInput) {
    const user = await this.userService.create(input);

    return { user, ...this.authService.generateAuthTokens(user) };
  }
}

import type { SignUpInput } from '@app/auth/dtos/sign-up-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserService } from '@app/user/services/user.service';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUseCase implements UseCaseHandler {
  public constructor(private readonly userService: UserService) {}

  public async handle(input: SignUpInput) {
    await this.userService.create(input);

    return {
      statusCode: HttpStatus.OK,
    };
  }
}

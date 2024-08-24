import { HashServiceContract } from '@app/auth/contracts';
import type { SignUpInput } from '@app/auth/dtos/sign-up-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { createUuidV4 } from '@app/shared/utils';
import { PrismaUserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SignUpUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: PrismaUserRepositoryContract,
    private readonly hashService: HashServiceContract
  ) {}

  public async handle(input: SignUpInput) {
    await this.userRepository.create({
      email: input.email,
      password: this.hashService.hash(input.password),
      name: input.name,
      uuid: createUuidV4(),
    });

    return {
      statusCode: HttpStatus.OK,
    };
  }
}

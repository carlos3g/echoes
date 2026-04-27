import type { UpdateMeInput } from '@app/auth/dtos/update-me-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/services/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateMeUseCase implements UseCaseHandler {
  public constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepositoryContract
  ) {}

  public async handle(input: UpdateMeInput): Promise<User> {
    const { user, ...rest } = input;

    if (rest.email) {
      await this.validateEmail(rest.email);
    }

    return this.userService.update({
      ...rest,
      userId: user.id,
    });
  }

  public async validateEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findUniqueByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
  }
}

import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { createUuidV4 } from '@app/shared/utils';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { CreateUserInput } from '@app/user/dtos/user-service-dtos';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashService: HashServiceContract
  ) {}

  public async create(input: CreateUserInput): Promise<User> {
    return this.userRepository.create({
      email: input.email,
      password: this.hashService.hash(input.password),
      name: input.name,
      uuid: createUuidV4(),
    });
  }
}

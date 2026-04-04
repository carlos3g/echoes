import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { Paginate } from '@app/shared/dtos/paginate';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import { UserFollowRepositoryContract } from '@app/user/contracts/user-follow-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface ListFollowersInput {
  username: string;
  paginate?: Paginate;
}

@Injectable()
export class ListFollowersUseCase implements UseCaseHandler {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly userFollowRepository: UserFollowRepositoryContract
  ) {}

  public async handle(input: ListFollowersInput): Promise<PaginatedResult<User>> {
    const { username, paginate } = input;
    const user = await this.userRepository.findUniqueOrThrow({ where: { username } });
    return this.userFollowRepository.listFollowers({ userId: user.id, options: paginate });
  }
}

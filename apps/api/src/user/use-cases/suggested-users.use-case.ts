import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { Paginate } from '@app/shared/dtos/paginate';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface SuggestedUsersInput {
  user?: User;
  paginate?: Paginate;
}

@Injectable()
export class SuggestedUsersUseCase implements UseCaseHandler {
  public constructor(private readonly userRepository: UserRepositoryContract) {}

  public async handle(input: SuggestedUsersInput): Promise<PaginatedResult<User>> {
    return this.userRepository.suggestedUsers({
      excludeUserId: input.user?.id,
      options: input.paginate,
    });
  }
}

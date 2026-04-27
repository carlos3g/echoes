import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { Paginate } from '@app/shared/dtos/paginate';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

export interface SearchUsersInput {
  query: string;
  paginate?: Paginate;
}

@Injectable()
export class SearchUsersUseCase implements UseCaseHandler {
  public constructor(private readonly userRepository: UserRepositoryContract) {}

  public async handle(input: SearchUsersInput): Promise<PaginatedResult<User>> {
    return this.userRepository.searchPaginated({
      query: input.query,
      options: input.paginate,
    });
  }
}

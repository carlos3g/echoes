import { AdminRepositoryContract } from '@app/admin/contracts/admin-repository.contract';
import type { PaginatedResult } from '@app/lib/prisma/helpers/pagination';
import type { UseCaseHandler } from '@app/shared/interfaces';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';

interface ListUsersPaginatedInput {
  search?: string;
  page?: number;
  perPage?: number;
}

@Injectable()
export class AdminListUsersPaginatedUseCase implements UseCaseHandler {
  public constructor(private readonly adminRepository: AdminRepositoryContract) {}

  public async handle(input: ListUsersPaginatedInput): Promise<PaginatedResult<User>> {
    return this.adminRepository.listUsersPaginated({
      search: input.search,
      options: { page: input.page, perPage: input.perPage },
    });
  }
}

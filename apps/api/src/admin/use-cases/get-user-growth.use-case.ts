import { AdminRepositoryContract } from '@app/admin/contracts/admin-repository.contract';
import type { UserGrowthPoint } from '@app/admin/contracts/admin-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserGrowthUseCase implements UseCaseHandler {
  public constructor(private readonly adminRepository: AdminRepositoryContract) {}

  public async handle(input: { days?: number }): Promise<UserGrowthPoint[]> {
    return this.adminRepository.getUserGrowth(input.days ?? 30);
  }
}

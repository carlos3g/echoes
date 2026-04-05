import { AdminRepositoryContract } from '@app/admin/contracts/admin-repository.contract';
import type { AnalyticsOverview } from '@app/admin/contracts/admin-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAnalyticsOverviewUseCase implements UseCaseHandler {
  public constructor(private readonly adminRepository: AdminRepositoryContract) {}

  public async handle(): Promise<AnalyticsOverview> {
    return this.adminRepository.getAnalyticsOverview();
  }
}

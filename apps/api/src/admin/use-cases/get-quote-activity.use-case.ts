import { AdminRepositoryContract } from '@app/admin/contracts/admin-repository.contract';
import type { QuoteActivityPoint } from '@app/admin/contracts/admin-repository.contract';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetQuoteActivityUseCase implements UseCaseHandler {
  public constructor(private readonly adminRepository: AdminRepositoryContract) {}

  public async handle(input: { days?: number }): Promise<QuoteActivityPoint[]> {
    return this.adminRepository.getQuoteActivity(input.days ?? 30);
  }
}

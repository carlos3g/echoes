import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DeleteUsedPasswordChangeRequestTask {
  public constructor(private readonly passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async handle(): Promise<void> {
    await this.passwordChangeRequestRepository.deleteUsed();
  }
}

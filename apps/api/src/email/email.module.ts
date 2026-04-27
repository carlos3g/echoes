import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { EmailService } from '@app/email/services/email-service.service';
import { resendClientProvider } from '@app/email/services/resend-client.provider';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    resendClientProvider,
    {
      provide: EmailServiceContract,
      useClass: EmailService,
    },
  ],
  exports: [EmailServiceContract],
})
export class EmailModule {}

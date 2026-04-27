import type { EmailServiceContract, EmailServiceSendInput } from '@app/email/contracts/email-service.contract';
import { ResendClient } from '@app/email/services/resend-client.provider';
import type { EnvVariables } from '@app/shared/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Resend } from 'resend';

@Injectable()
export class EmailService implements EmailServiceContract {
  private readonly logger = new Logger(EmailService.name);

  public constructor(
    @Inject(ResendClient) private readonly resend: Resend,
    private readonly configService: ConfigService<EnvVariables>
  ) {}

  public async send(input: EmailServiceSendInput): Promise<void> {
    const from = this.configService.getOrThrow<string>('MAIL_FROM');

    const { error } = await this.resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      react: input.react,
    });

    if (error) {
      this.logger.error(`Failed to send email "${input.subject}": ${error.message}`, error);
      throw new Error(`Email send failed: ${error.message}`);
    }
  }
}

import type { EmailServiceContract, EmailServiceSendInput } from '@app/email/contracts/email-service.contract';
import type { EnvVariables } from '@app/shared/types';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService implements EmailServiceContract {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<EnvVariables>
  ) {}

  public async send(input: EmailServiceSendInput): Promise<void> {
    await this.mailerService.sendMail({
      ...input,
      from: this.configService.get('MAIL_FROM'),
    });
  }
}

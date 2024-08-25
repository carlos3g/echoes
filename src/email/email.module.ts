import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { EmailService } from '@app/email/services/email-service.service';
import type { EnvVariables } from '@app/shared/types';
import { MailerModule } from '@nestjs-modules/mailer';
import { MjmlAdapter } from '@nestjs-modules/mailer/dist/adapters/mjml.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvVariables>) => ({
        transport: {
          pool: false,
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get<string>('MAIL_PORT')),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new MjmlAdapter('pug', { inlineCssEnabled: false }),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: EmailServiceContract,
      useClass: EmailService,
    },
  ],
  exports: [EmailServiceContract],
})
export class EmailModule {}

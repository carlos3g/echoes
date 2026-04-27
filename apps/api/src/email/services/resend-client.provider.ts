import type { EnvVariables } from '@app/shared/types';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export const ResendClient = Symbol('ResendClient');

export const resendClientProvider: Provider = {
  provide: ResendClient,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<EnvVariables>) =>
    new Resend(configService.getOrThrow<string>('RESEND_API_KEY')),
};

import type { EmailServiceSendInput } from '@app/email/contracts/email-service.contract';
import { EmailConfirmationEmail, EmailConfirmedEmail, ForgotPasswordEmail } from '@app/email/templates';
import * as React from 'react';

export const forgotPasswordTokenPreset = (input: {
  to: string;
  context: { token: string };
}): EmailServiceSendInput => ({
  subject: 'Código de redefinição de senha',
  to: input.to,
  react: React.createElement(ForgotPasswordEmail, { token: input.context.token }),
});

export const emailConfirmationTokenPreset = (input: {
  to: string;
  context: { link: string };
}): EmailServiceSendInput => ({
  subject: 'Confirme seu email',
  to: input.to,
  react: React.createElement(EmailConfirmationEmail, { link: input.context.link }),
});

export const emailConfirmedPreset = (input: { to: string }): EmailServiceSendInput => ({
  subject: 'Bem-vindo ao Echoes',
  to: input.to,
  react: React.createElement(EmailConfirmedEmail),
});

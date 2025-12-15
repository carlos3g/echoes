import type { EmailServiceSendInput } from '@app/email/contracts/email-service.contract';

export const forgotPasswordTokenPreset = (input: {
  to: string;
  context: {
    token: string;
  };
}): EmailServiceSendInput => {
  const { context, to } = input;

  return {
    subject: 'Código de redefinição de senha',
    template: 'forgot-password-token',
    to,
    context,
  };
};

export const emailConfirmationTokenPreset = (input: {
  to: string;
  context: {
    link: string;
  };
}): EmailServiceSendInput => {
  const { context, to } = input;

  return {
    subject: 'Confirmação de email',
    template: 'email-confirmation-token',
    to,
    context,
  };
};

export const emailConfirmedPreset = (input: { to: string }): EmailServiceSendInput => {
  const { to } = input;

  return {
    subject: 'Email Confirmado',
    template: 'email-confirmed',
    to,
    context: {},
  };
};

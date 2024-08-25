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

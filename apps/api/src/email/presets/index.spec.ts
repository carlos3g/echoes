import {
  emailConfirmationTokenPreset,
  emailConfirmedPreset,
  forgotPasswordTokenPreset,
} from '@app/email/presets';
import { EmailConfirmationEmail, EmailConfirmedEmail, ForgotPasswordEmail } from '@app/email/templates';
import { faker } from '@faker-js/faker';

describe('email presets', () => {
  describe('forgotPasswordTokenPreset', () => {
    it('should return correct shape with the ForgotPasswordEmail component and token prop', () => {
      const to = faker.internet.email();
      const token = faker.string.alphanumeric(6).toUpperCase();

      const result = forgotPasswordTokenPreset({ to, context: { token } });

      expect(result.to).toBe(to);
      expect(result.subject).toBe('Código de redefinição de senha');
      expect(result.react.type).toBe(ForgotPasswordEmail);
      expect(result.react.props).toEqual({ token });
    });
  });

  describe('emailConfirmationTokenPreset', () => {
    it('should return correct shape with the EmailConfirmationEmail component and link prop', () => {
      const to = faker.internet.email();
      const link = faker.internet.url();

      const result = emailConfirmationTokenPreset({ to, context: { link } });

      expect(result.to).toBe(to);
      expect(result.subject).toBe('Confirme seu email');
      expect(result.react.type).toBe(EmailConfirmationEmail);
      expect(result.react.props).toEqual({ link });
    });
  });

  describe('emailConfirmedPreset', () => {
    it('should return correct shape with the EmailConfirmedEmail component', () => {
      const to = faker.internet.email();

      const result = emailConfirmedPreset({ to });

      expect(result.to).toBe(to);
      expect(result.subject).toBe('Bem-vindo ao Echoes');
      expect(result.react.type).toBe(EmailConfirmedEmail);
      expect(result.react.props).toEqual({});
    });
  });
});

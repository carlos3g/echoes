import * as z from 'zod';
import i18next from '@/lib/i18n';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  withPasswordConfirmation,
} from '@/lib/zod/zod-predefinitions.helper';

export const createSignUpFormSchema = () =>
  withPasswordConfirmation(
    z.object({
      name: z.string().min(1, { message: i18next.t('validation.requiredField') }),
      email: validateEmail().optional(),
      password: validatePassword(),
      passwordConfirmation: validatePassword(),
      username: validateUsername(),
      acceptTerms: z.literal(true, {
        error: i18next.t('validation.acceptTerms'),
      }),
    })
  );

export const createLoginFormSchema = () =>
  z.object({
    email: validateEmail(),
    password: validatePassword(),
    remember: z.boolean(),
  });

export const createForgotPasswordFormSchema = () =>
  z.object({
    email: validateEmail(),
  });

export const createResetPasswordFormSchema = () =>
  withPasswordConfirmation(
    z.object({
      email: validateEmail(),
      password: validatePassword(),
      passwordConfirmation: validatePassword(),
      token: z.string(),
    })
  );

export const createChangePasswordFormSchema = () =>
  withPasswordConfirmation(
    z.object({
      currentPassword: validatePassword(),
      password: validatePassword(),
      passwordConfirmation: validatePassword(),
    })
  );

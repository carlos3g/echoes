import * as z from 'zod';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  withPasswordConfirmation,
} from '@/lib/zod/zod-predefinitions.helper';

export const signUpFormSchema = withPasswordConfirmation(
  z.object({
    name: z.string().min(1, { message: 'Campo obrigatório' }),
    email: validateEmail().optional(),
    password: validatePassword(),
    passwordConfirmation: validatePassword(),
    username: validateUsername(),
    acceptTerms: z.literal(true, {
      error: 'Você deve aceitar os termos de serviço',
    }),
  })
);

export const loginFormSchema = z.object({
  email: validateEmail(),
  password: validatePassword(),
  remember: z.boolean(),
});

export const forgotPasswordFormSchema = z.object({
  email: validateEmail(),
});

export const resetPasswordFormSchema = withPasswordConfirmation(
  z.object({
    email: validateEmail(),
    password: validatePassword(),
    passwordConfirmation: validatePassword(),
    token: z.string(),
  })
);

export const changePasswordFormSchema = withPasswordConfirmation(
  z.object({
    currentPassword: validatePassword(),
    password: validatePassword(),
    passwordConfirmation: validatePassword(),
  })
);

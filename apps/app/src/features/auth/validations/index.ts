import * as z from 'zod';
import { validateEmail, validatePassword, validateUsername } from '@/lib/zod/zod-predefinitions.helper';

export const signUpFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Campo obrigatório' }),
    email: validateEmail().optional(),
    password: validatePassword(),
    passwordConfirmation: validatePassword(),
    username: validateUsername(),
    acceptTerms: z.literal(true, {
      error: 'Você deve aceitar os termos de serviço',
    }),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'As senhas inseridas devem ser iguais',
    path: ['passwordConfirmation'],
  });

export const loginFormSchema = z.object({
  email: validateEmail(),
  password: validatePassword(),
  remember: z.boolean(),
});

export const forgotPasswordFormSchema = z.object({
  email: validateEmail(),
});

export const resetPasswordFormSchema = z
  .object({
    email: validateEmail(),
    password: validatePassword(),
    passwordConfirmation: validatePassword(),
    token: z.string(),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'As senhas inseridas devem ser iguais',
    path: ['passwordConfirmation'],
  });

export const changePasswordFormSchema = z
  .object({
    currentPassword: validatePassword(),
    password: validatePassword(),
    passwordConfirmation: validatePassword(),
  })
  .refine(({ password, passwordConfirmation }) => password === passwordConfirmation, {
    message: 'As senhas inseridas devem ser iguais',
    path: ['passwordConfirmation'],
  });

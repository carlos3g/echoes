import validator from 'validator';
import * as z from 'zod';
import i18next from '@/lib/i18n';

export const validateUuid = () =>
  z.string().refine((s) => validator.isUUID(s, '4'), { message: i18next.t('validation.invalid') });

export const validatePassword = () => z.string().min(8, { message: i18next.t('validation.passwordMin') });

export const validateEmail = () => z.string().email({ message: i18next.t('validation.invalidEmail') });

export const validateUsername = () =>
  z
    .string()
    .min(3, { message: i18next.t('validation.usernameMin') })
    .max(20, { message: i18next.t('validation.usernameMax') })
    .regex(/^[a-z0-9_-]+$/, {
      message: i18next.t('validation.usernamePattern'),
    });

export const withPasswordConfirmation = <T extends z.ZodObject<z.ZodRawShape>>(schema: T) =>
  schema.refine((data) => data.password === data.passwordConfirmation, {
    message: i18next.t('validation.passwordsMustMatch'),
    path: ['passwordConfirmation'],
  });

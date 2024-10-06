import validator from 'validator';
import * as z from 'zod';

export const validateUuid = () => z.string().refine((s) => validator.isUUID(s, '4'), { message: 'Inválido' });

export const validatePassword = () => z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres' });

export const validateEmail = () => z.string().email({ message: 'Email inválido' });

export const validateUsername = () =>
  z
    .string()
    .min(3, { message: 'Username deve ter pelo menos 3 caracteres' })
    .max(20, { message: 'Username deve ter no máximo 20 caracteres' })
    .regex(/^[a-z0-9_-]+$/, {
      message: 'Username deve conter apenas letras minúsculas, números, underlines e híphens',
    });

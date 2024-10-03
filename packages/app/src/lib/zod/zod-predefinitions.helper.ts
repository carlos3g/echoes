import validator from 'validator';
import * as z from 'zod';

export const validateUuid = () => z.string().refine((s) => validator.isUUID(s, '4'), { message: 'Inválido' });

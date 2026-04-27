import * as z from 'zod';
import i18next from '@/lib/i18n';

export const createFolderFormSchema = () =>
  z.object({
    name: z
      .string()
      .min(1, { message: i18next.t('validation.requiredField') })
      .max(100, { message: i18next.t('validation.maxChars', { max: 100 }) }),
    description: z
      .string()
      .max(500, { message: i18next.t('validation.maxChars', { max: 500 }) })
      .optional(),
    color: z.string().max(7).optional(),
    visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  });

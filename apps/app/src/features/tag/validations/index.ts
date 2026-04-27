import * as z from 'zod';
import i18next from '@/lib/i18n';

export const createTagFormSchema = () =>
  z.object({
    title: z
      .string()
      .min(1, { message: i18next.t('validation.requiredField') })
      .max(50, { message: i18next.t('validation.maxChars', { max: 50 }) }),
  });

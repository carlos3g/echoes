import * as z from 'zod';
import i18next from '@/lib/i18n';

const t = (key: string, params?: Record<string, unknown>) => i18next.t(`validation.${key}`, params);

const sizeKey = (origin: string | undefined, kind: 'tooSmall' | 'tooBig') => {
  switch (origin) {
    case 'string':
      return `${kind}String`;
    case 'array':
    case 'set':
      return `${kind}Array`;
    case 'number':
    case 'int':
    case 'bigint':
      return `${kind}Number`;
    default:
      return kind;
  }
};

export const zodErrorMap: z.core.$ZodErrorMap = (issue) => {
  switch (issue.code) {
    case 'invalid_type':
      return { message: t('invalidType') };

    case 'too_small':
      return {
        message: t(sizeKey(issue.origin, 'tooSmall'), { min: String(issue.minimum) }),
      };

    case 'too_big':
      return {
        message: t(sizeKey(issue.origin, 'tooBig'), { max: String(issue.maximum) }),
      };

    case 'invalid_format':
      if (issue.format === 'email') return { message: t('invalidEmail') };
      if (issue.format === 'url') return { message: t('invalidUrl') };
      return { message: t('invalid') };

    case 'invalid_value':
    case 'not_multiple_of':
      return { message: t('invalid') };

    case 'unrecognized_keys':
      return { message: t('unrecognizedKeys', { keys: issue.keys.join(', ') }) };

    default:
      return undefined;
  }
};

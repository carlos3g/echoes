import { clsx, type ClassValue } from 'clsx';
import numeral from 'numeral';
import { customTwMerge } from '@/lib/tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return customTwMerge(clsx(inputs));
};

export const humanizeNumber = (num: number): string => {
  const formatted = numeral(num).format(num % 1 === 0 ? '0a' : '0.0a');
  return formatted;
};

export { userAvatarUrl } from './user-avatar-url';

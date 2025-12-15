import { clsx, type ClassValue } from 'clsx';
import numeral from 'numeral';
import { customTwMerge } from '@/lib/tailwind-merge';
import type { User } from '@/types/entities';

export const cn = (...inputs: ClassValue[]): string => {
  return customTwMerge(clsx(inputs));
};

export const humanizeNumber = (num: number): string => {
  const formatted = numeral(num).format(num % 1 === 0 ? '0a' : '0.0a');
  return formatted;
};

export const userAvatarUrl = (user: User): string => {
  return `${process.env.EXPO_PUBLIC_API_URL}/users/${user.uuid}.webp`;
};

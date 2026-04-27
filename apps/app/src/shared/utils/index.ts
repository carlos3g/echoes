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

export function formatRelativeTime(timestamp: number | string): string {
  const then = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'ontem';
  if (days < 30) return `${days}d`;
  return new Date(then).toLocaleDateString();
}

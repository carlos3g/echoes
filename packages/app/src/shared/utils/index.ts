import { clsx, type ClassValue } from 'clsx';
import { customTwMerge } from '@/lib/tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}

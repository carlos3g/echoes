import type { User } from '@/types/entities';

export const getApiBaseUrl = (): string | undefined => process.env.EXPO_PUBLIC_API_URL;

export const userAvatarUrl = (user: Pick<User, 'uuid'>, baseUrl: string | undefined = getApiBaseUrl()): string => {
  return `${baseUrl}/users/${user.uuid}.webp`;
};

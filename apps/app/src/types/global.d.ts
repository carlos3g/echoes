import type { AppTabParams } from '@/navigation/app.navigator.types';
import type { AuthStackParams } from '@/navigation/auth.navigator.types';
import type { Entries } from 'type-fest';

type RootParams = AuthStackParams & AppTabParams;

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>;

    keys<T extends object>(object: T): (keyof T)[];
  }

  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootParams {}
  }

  declare namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      SENTRY_ORG: string;
      SENTRY_PROJECT: string;
      EXPO_PUBLIC_SENTRY_PROJECT_DSN: string;
      SENTRY_AUTH_TOKEN: string;
    }
  }
}

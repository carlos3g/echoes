import type { Entries } from 'type-fest';

declare global {
  interface ObjectConstructor {
    entries<T extends object>(o: T): Entries<T>;

    keys<T extends object>(object: T): (keyof T)[];
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
  }
}

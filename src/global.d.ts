import type { User } from '@app/users/entities/user.entity';

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: string;
    readonly DEBUG: string;

    readonly API_PORT: string;
    readonly JWT_SECRET: string;

    readonly DB_HOST: string;
    readonly DB_PORT: string;
    readonly DB_DATABASE: string;
    readonly DB_USERNAME: string;
    readonly DB_PASSWORD: string;
    readonly DB_SCHEMA: string;
    readonly DB_URL: string;
  }
}

declare global {
  declare namespace Express {
    interface Request {
      user?: User;
    }
  }
}

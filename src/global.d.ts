import type { User } from '@app/users/entities/user.entity';

declare namespace NodeJS {
  interface ProcessEnv extends EnvVariables {}
}

declare global {
  declare namespace Express {
    interface Request {
      user?: User;
    }
  }
}

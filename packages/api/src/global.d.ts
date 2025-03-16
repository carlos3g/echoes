import type { EnvVariables } from '@app/shared/types';
import type { User } from '@app/user/entities/user.entity';

declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProcessEnv extends EnvVariables {}
}

declare global {
  declare namespace Express {
    interface Request {
      user?: User;
    }
  }
}

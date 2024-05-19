import type { User } from '@app/users/entities/user.entity';

abstract class AuthServiceContract {
  public abstract generateAuthTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  };

  public abstract getUserByToken(token: string): Promise<User>;
}

export { AuthServiceContract };

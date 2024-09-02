import type { User } from '@app/user/entities/user.entity';

abstract class AuthServiceContract {
  public abstract generateAuthTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  };

  public abstract getUserByToken(token: string): Promise<User>;

  public abstract createPasswordChangeRequest(args: { userId: number }): Promise<{ token: string }>;
}

export { AuthServiceContract };

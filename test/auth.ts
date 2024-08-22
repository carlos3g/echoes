import type { AppModule } from '@app/app.module';
import { AuthServiceContract } from '@app/auth/contracts';
import { UserRepositoryContract } from '@app/users/contracts/user-repository.contract';
import type { User } from '@app/users/entities/user.entity';
import type { INestApplication } from '@nestjs/common';

export const getAccessToken = async (app: INestApplication<AppModule>, payload: { email: string }) => {
  const { email } = payload;

  const authService = app.get<AuthServiceContract>(AuthServiceContract);
  const userRepository = app.get<UserRepositoryContract>(UserRepositoryContract);

  const user: User = await userRepository.findUniqueOrThrow({ where: { email } });
  return authService.generateAuthTokens(user).accessToken;
};

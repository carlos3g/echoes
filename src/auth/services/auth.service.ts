import type { AuthServiceContract } from '@app/auth/contracts';
import { JwtServiceContract } from '@app/auth/contracts';
import type { JwtPayload } from '@app/auth/dtos/jwt-payload';
import type { EnvVariables } from '@app/shared/types';
import { PrismaUserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements AuthServiceContract {
  public constructor(
    private readonly jwtService: JwtServiceContract,
    private readonly userRepository: PrismaUserRepositoryContract,
    private readonly configService: ConfigService<EnvVariables>
  ) {}

  public getUserByToken(token: string): Promise<User> {
    const { sub: uuid } = this.jwtService.decode<JwtPayload>(token);

    return this.userRepository.findUniqueOrThrow({
      where: {
        uuid,
      },
    });
  }

  public generateAuthTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload: JwtPayload = {
      sub: user.uuid,
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '7d', secret: this.configService.get('JWT_SECRET') }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '21d', secret: this.configService.get('JWT_SECRET') }),
    };
  }
}

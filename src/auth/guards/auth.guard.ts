import { AuthServiceContract, JwtServiceContract } from '@app/auth/contracts';
import type { EnvVariables } from '@app/shared/types';
import type { ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class AuthGuard {
  public constructor(
    private readonly authService: AuthServiceContract,
    private readonly jwtService: JwtServiceContract,
    private readonly configService: ConfigService<EnvVariables>
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getAccessTokenOrThrow(request);

    this.verifyToken(token);

    const user = await this.authService.getUserByToken(token);

    request.user = user;

    return true;
  }

  private verifyToken(token: string): void {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  private getAccessTokenOrThrow(request: Request): string | never {
    const header = request.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    return header.split(' ')[1];
  }
}

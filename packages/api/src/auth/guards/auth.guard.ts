import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import { JwtServiceContract } from '@app/auth/contracts/jwt-service.contract';
import { IS_PUBLIC_KEY } from '@app/auth/decorators/public.decorator';
import type { EnvVariables } from '@app/shared/types';
import type { ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class AuthGuard {
  public constructor(
    private readonly authService: AuthServiceContract,
    private readonly jwtService: JwtServiceContract,
    private readonly configService: ConfigService<EnvVariables>,
    private readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getAccessTokenOrThrow(request);

    this.verifyToken(token);

    request.user = await this.authService.getUserByToken(token);

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

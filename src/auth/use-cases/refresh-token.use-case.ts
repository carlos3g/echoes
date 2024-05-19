import { AuthServiceContract, JwtServiceContract } from '@app/auth/contracts';
import type { RefreshTokenInput } from '@app/auth/dtos/refresh-token-input';
import type { UseCaseHandler } from '@app/shared/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RefreshTokenUseCase implements UseCaseHandler {
  public constructor(
    private readonly authService: AuthServiceContract,
    private readonly jwtService: JwtServiceContract
  ) {}

  public async handler(input: RefreshTokenInput): Promise<unknown> {
    this.verifyToken(input.refreshToken);

    const user = await this.authService.getUserByToken(input.refreshToken);

    return this.authService.generateAuthTokens(user);
  }

  private verifyToken(token: string): void {
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}

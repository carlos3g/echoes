import type { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

interface DecodeOptions {
  complete?: boolean | undefined;
  json?: boolean | undefined;
}

abstract class JwtServiceContract {
  public abstract sign(payload: object, options?: JwtSignOptions): string;
  public abstract verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T;
  public abstract decode<T = any>(token: string, options?: DecodeOptions): T;
}

export { JwtServiceContract };

import type { HashServiceContract } from '@app/auth/contracts';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BCryptService implements HashServiceContract {
  public compare(value: string, hash: string): boolean {
    return bcrypt.compareSync(value, hash);
  }

  public hash(value: string): string {
    return bcrypt.hashSync(value, 10);
  }
}

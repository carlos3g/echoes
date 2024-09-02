import { EmailConfirmationTokenRepositoryContract } from '@app/auth/contracts/email-confirmation-token-repository.contract';
import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { emailConfirmationTokenPreset, emailConfirmedPreset } from '@app/email/presets';
import { Transaction } from '@app/lib/prisma/decorators/transaction.decorator';
import type { EnvVariables } from '@app/shared/types';
import { createUuidV4 } from '@app/shared/utils';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/services/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly userRepository: UserRepositoryContract,
    private readonly hashService: HashServiceContract,
    private readonly configService: ConfigService<EnvVariables>,
    private readonly userService: UserService,
    private readonly emailConfirmationTokenRepository: EmailConfirmationTokenRepositoryContract,
    private readonly emailService: EmailServiceContract
  ) {}

  @Transaction()
  public async confirmEmail(payload: { token: string; user: User }): Promise<void> {
    const { token, user } = payload;

    await this.emailConfirmationTokenRepository.update({
      where: { token },
      data: { usedAt: DateTime.now().toJSDate() },
    });
    await this.userService.markEmailAsVerified({ userId: user.id });

    void this.emailService.send(emailConfirmedPreset({ to: user.email }));
  }

  public async sendConfirmEmail(input: { user: User }): Promise<void> {
    const { user } = input;

    await this.emailConfirmationTokenRepository.deleteMany({
      where: { userId: user.id },
    });

    const token = createUuidV4();

    await this.emailConfirmationTokenRepository.create({
      userId: user.id,
      token: this.hashService.hash(token),
      expiresAt: DateTime.now().plus({ days: 1 }).toJSDate(),
    });

    const link = `${this.configService.getOrThrow('API_DNS')}/auth/email/confirm/${token}`;

    void this.emailService.send(
      emailConfirmationTokenPreset({
        to: user.email,
        context: { link },
      })
    );
  }
}

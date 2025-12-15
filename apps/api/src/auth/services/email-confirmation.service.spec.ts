import { EmailConfirmationTokenRepositoryContract } from '@app/auth/contracts/email-confirmation-token-repository.contract';
import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import type { EmailConfirmationToken } from '@app/auth/entities/email-confirmation-token.entity';
import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { emailConfirmationTokenPreset, emailConfirmedPreset } from '@app/email/presets';
import { PrismaTransactionScopeService } from '@app/lib/prisma/services/transaction-scope.service';
import { createUuidV4 } from '@app/shared/utils';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/services/user.service';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { EmailConfirmationService } from './email-confirmation.service';

jest.mock('@app/shared/utils', () => ({
  createUuidV4: jest.fn().mockImplementation(() => faker.string.uuid()),
}));

const makeUserRepositoryMock = () => ({});
const makeHashServiceMock = () => ({
  hash: jest.fn(),
});
const makeEmailServiceMock = () => ({
  send: jest.fn(),
});
const makeUserServiceMock = () => ({
  markEmailAsVerified: jest.fn(),
});
const makeEmailConfirmationTokenRepositoryMock = () => ({
  update: jest.fn(),
  deleteMany: jest.fn(),
  create: jest.fn(),
});
const makeTransactionScopeMock = () => ({
  run: jest.fn().mockImplementation((fn: () => void) => fn()),
});
const makeConfigServiceMock = () => ({
  getOrThrow: jest.fn(),
});

describe('EmailConfirmationService', () => {
  let service: EmailConfirmationService;
  let userService: jest.Mocked<UserService>;
  let emailService: jest.Mocked<EmailServiceContract>;
  let emailConfirmationTokenRepository: jest.Mocked<EmailConfirmationTokenRepositoryContract>;
  let hashService: jest.Mocked<HashServiceContract>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailConfirmationService,
        {
          provide: UserRepositoryContract,
          useFactory: makeUserRepositoryMock,
        },
        {
          provide: HashServiceContract,
          useFactory: makeHashServiceMock,
        },
        {
          provide: EmailServiceContract,
          useFactory: makeEmailServiceMock,
        },
        {
          provide: UserService,
          useFactory: makeUserServiceMock,
        },
        {
          provide: EmailConfirmationTokenRepositoryContract,
          useFactory: makeEmailConfirmationTokenRepositoryMock,
        },
        {
          provide: ConfigService,
          useFactory: makeConfigServiceMock,
        },
        {
          provide: PrismaTransactionScopeService,
          useFactory: makeTransactionScopeMock,
        },
      ],
    }).compile();

    service = module.get<EmailConfirmationService>(EmailConfirmationService);
    userService = module.get(UserService);
    emailService = module.get(EmailServiceContract);
    emailConfirmationTokenRepository = module.get(EmailConfirmationTokenRepositoryContract);
    hashService = module.get(HashServiceContract);
    configService = module.get(ConfigService);
  });

  describe('confirmEmail', () => {
    it('should mark the email as verified and update the token', async () => {
      const token = faker.string.uuid();
      const user = { id: faker.number.int(), email: faker.internet.email() } as User;

      await service.confirmEmail({ token, user });

      expect(emailConfirmationTokenRepository.update).toHaveBeenCalledWith({
        where: { token },
        data: { usedAt: expect.any(Date) as Date },
      });
      expect(userService.markEmailAsVerified).toHaveBeenCalledWith({ userId: user.id });
      expect(emailService.send).toHaveBeenCalledWith(emailConfirmedPreset({ to: user.email }));
    });
  });

  describe('sendConfirmEmail', () => {
    it('should create a new token, delete old ones, and send a confirmation email', async () => {
      const user = { id: faker.number.int(), email: faker.internet.email() } as User;
      const token = faker.string.uuid();
      const hashedToken = `${token}-hashed`;

      hashService.hash.mockReturnValue(hashedToken);
      emailConfirmationTokenRepository.create.mockResolvedValue({
        userId: user.id,
        token: hashedToken,
        expiresAt: DateTime.now().plus({ days: 1 }).toJSDate(),
      } as EmailConfirmationToken);
      configService.getOrThrow.mockReturnValue('http://localhost');
      (createUuidV4 as jest.Mock).mockReturnValue(token);

      await service.sendConfirmEmail({ user });

      expect(emailConfirmationTokenRepository.deleteMany).toHaveBeenCalledWith({
        where: { userId: user.id },
      });
      expect(emailConfirmationTokenRepository.create).toHaveBeenCalledWith({
        userId: user.id,
        token: hashedToken,
        expiresAt: expect.any(Date) as Date,
      });
      expect(emailService.send).toHaveBeenCalledWith(
        emailConfirmationTokenPreset({
          to: user.email,
          context: { link: `http://localhost/auth/email/confirm/${token}` },
        })
      );
    });
  });
});

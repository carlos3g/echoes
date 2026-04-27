import { AuthServiceContract } from '@app/auth/contracts/auth-service.contract';
import { PasswordChangeRequestRepositoryContract } from '@app/auth/contracts/password-change-request-repository.contract';
import type { PasswordChangeRequest } from '@app/auth/entities/password-change-request.entity';
import { ForgotPasswordUseCase } from '@app/auth/use-cases/forgot-password.use-case';
import { EmailServiceContract } from '@app/email/contracts/email-service.contract';
import { forgotPasswordTokenPreset } from '@app/email/presets';
import { createUuidV4 } from '@app/shared/utils';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

jest.mock('@app/shared/utils', () => ({
  createUuidV4: jest.fn(),
}));

const makeUserRepositoryMock = () => ({
  findUniqueOrThrow: jest.fn(),
});

const makePasswordChangeRequestRepositoryMock = () => ({
  deleteMany: jest.fn(),
  create: jest.fn(),
});

const makeEmailServiceMock = () => ({
  send: jest.fn(),
});

const makeAuthServiceMock = () => ({
  createPasswordChangeRequest: jest.fn(),
});

describe('ForgotPasswordUseCase', () => {
  let forgotPasswordUseCase: ForgotPasswordUseCase;
  let userRepository: UserRepositoryContract;
  let passwordChangeRequestRepository: PasswordChangeRequestRepositoryContract;
  let emailService: EmailServiceContract;
  let authService: AuthServiceContract;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordUseCase,
        { provide: UserRepositoryContract, useFactory: makeUserRepositoryMock },
        { provide: PasswordChangeRequestRepositoryContract, useFactory: makePasswordChangeRequestRepositoryMock },
        { provide: EmailServiceContract, useFactory: makeEmailServiceMock },
        { provide: AuthServiceContract, useFactory: makeAuthServiceMock },
      ],
    }).compile();

    forgotPasswordUseCase = module.get<ForgotPasswordUseCase>(ForgotPasswordUseCase);
    userRepository = module.get<UserRepositoryContract>(UserRepositoryContract);
    passwordChangeRequestRepository = module.get<PasswordChangeRequestRepositoryContract>(
      PasswordChangeRequestRepositoryContract
    );
    emailService = module.get<EmailServiceContract>(EmailServiceContract);
    authService = module.get<AuthServiceContract>(AuthServiceContract);
  });

  it('should generate a hashed password change token', async () => {
    const input = { email: faker.internet.email() };
    const user = { id: faker.string.uuid(), email: input.email } as unknown as User;
    const token = faker.string.uuid();

    jest.spyOn(userRepository, 'findUniqueOrThrow').mockResolvedValue(user);
    jest.spyOn(passwordChangeRequestRepository, 'deleteMany').mockResolvedValue({ count: 0 });
    const spy = jest
      .spyOn(authService, 'createPasswordChangeRequest')
      .mockResolvedValue({ token } as PasswordChangeRequest);
    jest.spyOn(emailService, 'send').mockResolvedValue();
    (createUuidV4 as jest.Mock).mockReturnValue(token);

    await forgotPasswordUseCase.handle(input);

    expect(spy).toHaveBeenCalledWith({
      userId: user.id,
    });
  });

  it('should send unhashed token via email', async () => {
    const input = { email: faker.internet.email() };
    const user = { id: faker.string.uuid(), email: input.email } as unknown as User;
    const token = faker.string.uuid();

    jest.spyOn(userRepository, 'findUniqueOrThrow').mockResolvedValue(user);
    jest.spyOn(passwordChangeRequestRepository, 'deleteMany').mockResolvedValue({ count: 0 });
    jest.spyOn(authService, 'createPasswordChangeRequest').mockResolvedValue({ token } as PasswordChangeRequest);
    jest.spyOn(emailService, 'send').mockResolvedValue();
    (createUuidV4 as jest.Mock).mockReturnValue(token);

    await forgotPasswordUseCase.handle(input);

    expect(emailService.send).toHaveBeenCalledWith(
      forgotPasswordTokenPreset({
        to: user.email,
        context: { token },
      })
    );
  });

  it('should delete existing password change requests', async () => {
    const input = { email: faker.internet.email() };
    const user = { id: faker.string.uuid(), email: input.email } as unknown as User;
    const token = faker.string.uuid();

    jest.spyOn(userRepository, 'findUniqueOrThrow').mockResolvedValue(user);
    jest.spyOn(passwordChangeRequestRepository, 'deleteMany').mockResolvedValue({ count: 0 });
    jest.spyOn(authService, 'createPasswordChangeRequest').mockResolvedValue({ token } as PasswordChangeRequest);
    jest.spyOn(emailService, 'send').mockResolvedValue();
    (createUuidV4 as jest.Mock).mockReturnValue(token);

    await forgotPasswordUseCase.handle(input);

    expect(passwordChangeRequestRepository.deleteMany).toHaveBeenCalledWith({ where: { userId: user.id } });
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const input = { email: faker.internet.email() };

    jest.spyOn(userRepository, 'findUniqueOrThrow').mockRejectedValue(new NotFoundException());

    await expect(forgotPasswordUseCase.handle(input)).rejects.toThrow(NotFoundException);
  });
});

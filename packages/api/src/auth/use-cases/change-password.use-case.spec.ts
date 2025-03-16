import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import type { ChangePasswordInput } from '@app/auth/dtos/change-password-input';
import { ChangePasswordUseCase } from '@app/auth/use-cases/change-password.use-case';
import type { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/services/user.service';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

const makeUserServiceMock = () => ({
  update: jest.fn(),
});

const makeHashServiceMock = () => ({
  compare: jest.fn(),
});

describe('ChangePasswordUseCase', () => {
  let changePasswordUseCase: ChangePasswordUseCase;
  let userService: jest.Mocked<UserService>;
  let hashService: jest.Mocked<HashServiceContract>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordUseCase,
        {
          provide: UserService,
          useFactory: makeUserServiceMock,
        },
        {
          provide: HashServiceContract,
          useFactory: makeHashServiceMock,
        },
      ],
    }).compile();

    changePasswordUseCase = module.get<ChangePasswordUseCase>(ChangePasswordUseCase);
    userService = module.get(UserService);
    hashService = module.get(HashServiceContract);
  });

  describe('handle', () => {
    it('should update the user password if the current password is correct', async () => {
      const password = faker.internet.password();
      const input: ChangePasswordInput = {
        user: {
          id: faker.number.int(),
          password: faker.internet.password(),
        } as User,
        currentPassword: faker.internet.password(),
        password,
        passwordConfirmation: password,
      };

      hashService.compare.mockReturnValue(true);

      await changePasswordUseCase.handle(input);

      expect(hashService.compare).toHaveBeenCalledWith(input.currentPassword, input.user.password);
      expect(userService.update).toHaveBeenCalledWith({
        password: input.password,
        userId: input.user.id,
      });
    });

    it('should throw UnauthorizedException if the current password is incorrect', async () => {
      const password = faker.internet.password();
      const input: ChangePasswordInput = {
        user: {
          id: faker.number.int(),
          password: faker.internet.password(),
        } as User,
        currentPassword: faker.internet.password(),
        password,
        passwordConfirmation: password,
      };

      hashService.compare.mockReturnValue(false);

      await expect(changePasswordUseCase.handle(input)).rejects.toThrow(UnauthorizedException);
      expect(hashService.compare).toHaveBeenCalledWith(input.currentPassword, input.user.password);
      expect(userService.update).not.toHaveBeenCalled();
    });
  });
});

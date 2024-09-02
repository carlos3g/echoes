import type { UpdateMeInput } from '@app/auth/dtos/update-me-input';
import { UpdateMeUseCase } from '@app/auth/use-cases/update-me.use-case';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { User } from '@app/user/entities/user.entity';
import { UserService } from '@app/user/services/user.service';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

const makeUserServiceMock = () => ({
  update: jest.fn(),
});

const makeUserRepositoryMock = () => ({
  findUniqueByEmail: jest.fn(),
});

describe('UpdateMeUseCase', () => {
  let updateMeUseCase: UpdateMeUseCase;
  let userService: jest.Mocked<UserService>;
  let userRepository: jest.Mocked<UserRepositoryContract>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMeUseCase,
        {
          provide: UserService,
          useFactory: makeUserServiceMock,
        },
        {
          provide: UserRepositoryContract,
          useFactory: makeUserRepositoryMock,
        },
      ],
    }).compile();

    updateMeUseCase = module.get<UpdateMeUseCase>(UpdateMeUseCase);
    userService = module.get(UserService);
    userRepository = module.get(UserRepositoryContract);
  });

  describe('handle', () => {
    it('should update user details if the email is not in use', async () => {
      const input: UpdateMeInput = {
        user: {
          id: faker.number.int(),
        } as User,
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
      const updatedUser = {
        id: input.user.id,
        email: input.email,
        name: input.name,
      } as User;

      userRepository.findUniqueByEmail.mockResolvedValue(null);
      userService.update.mockResolvedValue(updatedUser);

      const result = await updateMeUseCase.handle(input);

      expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(input.email);
      expect(userService.update).toHaveBeenCalledWith({
        email: input.email,
        name: input.name,
        userId: input.user.id,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException if the email is already in use', async () => {
      const input: UpdateMeInput = {
        user: {
          id: faker.number.int(),
        } as User,
        email: faker.internet.email(),
      };

      userRepository.findUniqueByEmail.mockResolvedValue({ id: faker.number.int() } as User);

      await expect(updateMeUseCase.handle(input)).rejects.toThrow(BadRequestException);
      expect(userRepository.findUniqueByEmail).toHaveBeenCalledWith(input.email);
      expect(userService.update).not.toHaveBeenCalled();
    });
  });
});

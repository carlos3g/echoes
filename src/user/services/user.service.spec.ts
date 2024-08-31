import { HashServiceContract } from '@app/auth/contracts/hash-service.contract';
import { PrismaTransactionScopeService } from '@app/lib/prisma/services/transaction-scope.service';
import { FileRepositoryContract } from '@app/storage/contracts/file-repository.contract';
import { StorageServiceContract } from '@app/storage/contracts/storage-service.contract';
import type { FileEntity } from '@app/storage/entities/file.entity';
import { UserRepositoryContract } from '@app/user/contracts/user-repository.contract';
import type { CreateUserInput, UpdateUserInput } from '@app/user/dtos/user-service-dtos';
import type { User } from '@app/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { BadRequestException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

const makeUserRepositoryMock = () => ({
  findUniqueOrThrow: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
});

const makeHashServiceMock = () => ({
  hash: jest.fn(),
});

const makeStorageServiceMock = () => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
});

const makeFileRepositoryMock = () => ({
  findUniqueOrThrow: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

const makeTransactionScopeMock = () => ({
  run: jest.fn().mockImplementation((fn: () => void) => fn()),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepositoryContract>;
  let hashService: jest.Mocked<HashServiceContract>;
  let storageService: jest.Mocked<StorageServiceContract>;
  let fileRepository: jest.Mocked<FileRepositoryContract>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepositoryContract,
          useFactory: makeUserRepositoryMock,
        },
        {
          provide: HashServiceContract,
          useFactory: makeHashServiceMock,
        },
        {
          provide: StorageServiceContract,
          useFactory: makeStorageServiceMock,
        },
        {
          provide: FileRepositoryContract,
          useFactory: makeFileRepositoryMock,
        },
        {
          provide: PrismaTransactionScopeService,
          useFactory: makeTransactionScopeMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepositoryContract);
    hashService = module.get(HashServiceContract);
    storageService = module.get(StorageServiceContract);
    fileRepository = module.get(FileRepositoryContract);
  });

  describe('create', () => {
    it('should create a new user with hashed password and optional avatar', async () => {
      const avatar = {
        originalname: faker.system.commonFileName('png'),
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;
      const input: CreateUserInput = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        avatar,
      };
      const hashedPassword = `${input.password}hash`;
      const createdUser = {
        ...input,
        id: faker.number.int(),
        password: hashedPassword,
      } as User;

      const createdFile = { id: faker.number.int(), bucket: 'avatars', key: avatar.originalname } as FileEntity;

      userRepository.create.mockResolvedValue(createdUser);
      storageService.set.mockResolvedValue({ key: avatar.originalname });
      fileRepository.create.mockResolvedValue(createdFile);
      hashService.hash.mockReturnValue(hashedPassword);

      const result = await userService.create(input);

      expect(storageService.set).toHaveBeenCalledWith({
        bucket: 'avatars',
        key: avatar.originalname,
        value: avatar.buffer,
      });
      expect(hashService.hash).toHaveBeenCalledWith(input.password);
      expect(fileRepository.create).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledWith({
        email: input.email,
        password: hashedPassword,
        name: input.name,
        uuid: expect.any(String) as string,
        avatarId: createdFile.id,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('deleteAvatar', () => {
    it('should delete the user avatar if it exists', async () => {
      const file = { id: faker.number.int(), bucket: 'avatars', key: faker.system.commonFileName('png') } as FileEntity;
      const user = { id: faker.number.int(), avatarId: file.id } as User;

      fileRepository.findUniqueOrThrow.mockResolvedValue(file);

      await userService.deleteAvatar({ user });

      expect(fileRepository.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: user.avatarId } });
      expect(storageService.delete).toHaveBeenCalledWith({ bucket: file.bucket, key: file.key });
      expect(fileRepository.delete).toHaveBeenCalledWith({ where: { id: user.avatarId } });
    });

    it('should do nothing if the user has no avatar', async () => {
      const user = { id: 1 } as User;

      await userService.deleteAvatar({ user });

      expect(fileRepository.findUniqueOrThrow).not.toHaveBeenCalled();
      expect(storageService.delete).not.toHaveBeenCalled();
      expect(fileRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user with new data and hashed password if provided', async () => {
      const input: UpdateUserInput = {
        userId: faker.number.int(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
      };
      const hashedPassword = `${input.password}hash`;
      const updatedUser = {
        id: input.userId,
        email: input.email,
        password: hashedPassword,
        name: input.name,
      } as User;

      userRepository.update.mockResolvedValue(updatedUser);
      hashService.hash.mockReturnValue(hashedPassword);

      const result = await userService.update(input);

      expect(hashService.hash).toHaveBeenCalledWith(input.password);
      expect(userRepository.update).toHaveBeenCalledWith({
        where: { id: input.userId },
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw BadRequestException if the user is not found', async () => {
      const input: UpdateUserInput = {
        userId: faker.number.int(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };

      userRepository.update.mockRejectedValue(new BadRequestException('User not found'));

      await expect(userService.update(input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateAvatar', () => {
    it('should update user avatar and delete the old one', async () => {
      const userId = faker.number.int();
      const avatar = {
        originalname: faker.system.commonFileName('png'),
        buffer: Buffer.from(faker.lorem.word()),
      } as Express.Multer.File;
      const oldAvatar = {
        id: faker.number.int(),
        bucket: 'avatars',
        key: faker.system.commonFileName('png'),
      } as FileEntity;
      const newAvatar = { id: faker.number.int(), bucket: 'avatars', key: avatar.originalname } as FileEntity;

      const user = { id: userId, avatarId: oldAvatar.id } as User;

      userRepository.findUniqueOrThrow.mockResolvedValue(user);
      userRepository.update.mockResolvedValue({ ...user, avatarId: newAvatar.id });
      fileRepository.findUniqueOrThrow.mockResolvedValue(oldAvatar);
      fileRepository.create.mockResolvedValue(newAvatar);
      storageService.set.mockResolvedValue({ key: avatar.originalname });

      const result = await userService.updateAvatar({ userId, avatar });

      expect(userRepository.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: userId } });
      expect(storageService.delete).toHaveBeenCalledWith({ bucket: oldAvatar.bucket, key: oldAvatar.key });
      expect(fileRepository.delete).toHaveBeenCalledWith({ where: { id: oldAvatar.id } });
      expect(userRepository.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { avatarId: newAvatar.id },
      });
      expect(result).toEqual({ ...user, avatarId: newAvatar.id });
    });
  });

  describe('getAvatar', () => {
    it('should retrieve the user avatar as a buffer', async () => {
      const file = { id: faker.number.int(), bucket: 'avatars', key: faker.system.commonFileName('png') } as FileEntity;
      const user = { id: faker.number.int(), avatarId: file.id } as User;
      const buffer = Buffer.from(faker.lorem.word());

      fileRepository.findUniqueOrThrow.mockResolvedValue(file);
      storageService.get.mockResolvedValue(buffer);

      const result = await userService.getAvatar({ user });

      expect(fileRepository.findUniqueOrThrow).toHaveBeenCalledWith({ where: { id: user.avatarId } });
      expect(storageService.get).toHaveBeenCalledWith({ bucket: file.bucket, key: file.key });
      expect(result).toEqual(buffer);
    });

    it('should throw a BadRequestException if the user has no avatar', async () => {
      const user = { id: faker.number.int() } as User;

      await expect(userService.getAvatar({ user })).rejects.toThrow(BadRequestException);
    });
  });
});

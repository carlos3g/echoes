import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { PrismaUserRepository } from '@app/user/repositories/prisma-user.repository';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { userFactory } from '@test/factories';
import { prisma } from '@test/server';

describe('PrismaUserRepository', () => {
  let userRepository: PrismaUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaUserRepository],
    }).compile();

    userRepository = module.get<PrismaUserRepository>(PrismaUserRepository);
  });

  describe('create', () => {
    it('should create new quote', async () => {
      const payload = userFactory();

      const result = await userRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a user by id', async () => {
      const createdUser = await prisma.user.create({
        data: userFactory(),
      });

      const result = await userRepository.findUniqueOrThrow({
        where: { id: Number(createdUser.id) },
      });

      expect(result).toMatchObject({
        ...createdUser,
        id: Number(createdUser.id),
        uuid: createdUser.uuid,
      });
    });

    it('should find a user by uuid', async () => {
      const createdUser = await prisma.user.create({
        data: userFactory(),
      });

      const result = await userRepository.findUniqueOrThrow({
        where: { uuid: createdUser.uuid },
      });

      expect(result).toMatchObject({
        ...createdUser,
        id: Number(createdUser.id),
        uuid: createdUser.uuid,
      });
    });

    it('should find a user by email', async () => {
      const createdUser = await prisma.user.create({
        data: userFactory(),
      });

      const result = await userRepository.findUniqueOrThrow({
        where: { email: createdUser.email },
      });

      expect(result).toMatchObject({
        ...createdUser,
        id: Number(createdUser.id),
        uuid: createdUser.uuid,
      });
    });

    it('should find a user by username', async () => {
      const createdUser = await prisma.user.create({
        data: userFactory(),
      });

      const result = await userRepository.findUniqueOrThrow({
        where: { username: createdUser.username },
      });

      expect(result).toMatchObject({
        ...createdUser,
        id: Number(createdUser.id),
        uuid: createdUser.uuid,
      });
    });

    it('should throw an error if user not found', async () => {
      await expect(userRepository.findUniqueOrThrow({ where: { uuid: 'non-existent-uuid' } })).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const createdUser = await prisma.user.create({
        data: userFactory(),
      });

      const newName = faker.lorem.sentence();

      const result = await userRepository.update({
        where: { uuid: createdUser.uuid },
        data: { name: newName },
      });

      expect(result.name).toBe(newName);
    });
  });

  describe('findUniqueByEmail', () => {
    it('should find a user by email', async () => {
      const createdUser = await prisma.user.create({
        data: userFactory(),
      });

      const result = await userRepository.findUniqueByEmail(createdUser.email);

      expect(result).toMatchObject({
        ...createdUser,
        id: Number(createdUser.id),
        uuid: createdUser.uuid,
      });
    });

    it('should return null if user not found', async () => {
      await expect(userRepository.findUniqueByEmail(faker.internet.email())).resolves.toBeNull();
    });
  });
});

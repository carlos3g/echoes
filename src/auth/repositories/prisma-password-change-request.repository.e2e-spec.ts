import { PrismaPasswordChangeRequestRepository } from '@app/auth/repositories/prisma-password-change-request.repository';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { userFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

describe('PrismaPasswordChangeRequestRepository', () => {
  let passwordChangeRequestRepository: PrismaPasswordChangeRequestRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaPasswordChangeRequestRepository],
    }).compile();

    passwordChangeRequestRepository = module.get<PrismaPasswordChangeRequestRepository>(
      PrismaPasswordChangeRequestRepository
    );
  });

  describe('create', () => {
    it('should create new password-change-request', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const payload = { userId: Number(user.id), token: faker.string.uuid() };

      const result = await passwordChangeRequestRepository.create(payload);

      expect(result).toMatchObject({
        token: payload.token,
        userId: payload.userId,
      });
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a password-change-request by unique identifier', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdPasswordChangeRequest = await prisma.passwordChangeRequest.create({
        data: { token: faker.string.uuid(), userId: user.id },
      });

      const result = await passwordChangeRequestRepository.findUniqueOrThrow({
        where: { token: createdPasswordChangeRequest.token },
      });

      expect(result).toMatchObject({
        token: createdPasswordChangeRequest.token,
        userId: Number(createdPasswordChangeRequest.userId),
      });
    });

    it('should throw an error if password-change-request not found', async () => {
      await expect(
        passwordChangeRequestRepository.findUniqueOrThrow({
          where: { token: 'non-existent-id' },
        })
      ).rejects.toThrow();
    });
  });

  describe('findFirstOrThrow', () => {
    it('should find a password-change-request by non unique identifier', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdPasswordChangeRequest = await prisma.passwordChangeRequest.create({
        data: { token: faker.string.uuid(), userId: user.id },
      });

      const result = await passwordChangeRequestRepository.findFirstOrThrow({
        where: { userId: Number(user.id) },
      });

      expect(result).toMatchObject({
        token: createdPasswordChangeRequest.token,
        userId: Number(createdPasswordChangeRequest.userId),
      });
    });

    it('should throw an error if password-change-request not found', async () => {
      await expect(
        passwordChangeRequestRepository.findFirstOrThrow({
          where: { userId: 'non-existent-id' as unknown as number },
        })
      ).rejects.toThrow();
    });
  });

  describe('findFirstValidOrThrow', () => {
    it('should find a valid password-change-request by userId', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdPasswordChangeRequest = await prisma.passwordChangeRequest.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
        },
      });

      await expect(
        passwordChangeRequestRepository.findFirstValidOrThrow({
          where: { userId: Number(user.id) },
        })
      ).resolves.toMatchObject({
        token: createdPasswordChangeRequest.token,
        userId: Number(createdPasswordChangeRequest.userId),
      });
    });

    it('should throw an error if password-change-request not found', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.passwordChangeRequest.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
          usedAt: faker.date.recent(),
        },
      });

      await expect(
        passwordChangeRequestRepository.findFirstValidOrThrow({
          where: { userId: Number(user.id) },
        })
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing password-change-request', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdPasswordChangeRequest = await prisma.passwordChangeRequest.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
        },
      });

      const newUsedAt = faker.date.recent();

      const result = await passwordChangeRequestRepository.update({
        where: { token: createdPasswordChangeRequest.token },
        data: { usedAt: newUsedAt },
      });

      expect(result.usedAt?.toISOString()).toBe(newUsedAt.toISOString());
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple password-change-requests', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.passwordChangeRequest.createMany({
        data: [
          { token: 'token1', userId: user.id },
          { token: 'token2', userId: user.id },
        ],
      });

      const result = await passwordChangeRequestRepository.deleteMany({ where: { userId: Number(user.id) } });

      const remainingRequests = await prisma.passwordChangeRequest.findMany({
        where: { token: { in: ['token1', 'token2'] } },
      });

      expect(result.count).toBe(2);
      expect(remainingRequests).toHaveLength(0);
    });
  });

  describe('deleteUsed', () => {
    it('should delete used password-change-requests', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const data = _.range(10).map(() => ({
        token: faker.string.uuid(),
        userId: user.id,
        usedAt: faker.date.recent(),
      }));

      await prisma.passwordChangeRequest.createMany({ data });

      const result = await passwordChangeRequestRepository.deleteUsed();

      const remainingRequests = await prisma.passwordChangeRequest.findMany({
        where: { token: { in: data.map((d) => d.token) } },
      });

      expect(result.count).toBe(data.length);
      expect(remainingRequests).toHaveLength(0);
    });
  });

  it('should not delete unused password-change-requests', async () => {
    const user = await prisma.user.create({
      data: userFactory(),
    });

    const usedData = _.range(10).map(() => ({
      token: faker.string.uuid(),
      userId: user.id,
      usedAt: faker.date.recent(),
    }));

    const unusedData = _.range(10).map(() => ({
      token: faker.string.uuid(),
      userId: user.id,
    }));

    await prisma.passwordChangeRequest.createMany({ data: [...usedData, ...unusedData] });

    const result = await passwordChangeRequestRepository.deleteUsed();

    const remainingRequests = await prisma.passwordChangeRequest.findMany();

    expect(result.count).toBe(usedData.length);
    expect(remainingRequests).toHaveLength(unusedData.length);
  });
});

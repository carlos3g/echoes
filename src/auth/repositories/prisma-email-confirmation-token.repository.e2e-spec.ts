import { PrismaEmailConfirmationTokenRepository } from '@app/auth/repositories/prisma-email-confirmation-token.repository';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { userFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

describe('PrismaEmailConfirmationTokenRepository', () => {
  let emailConfirmationTokenRepository: PrismaEmailConfirmationTokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaEmailConfirmationTokenRepository],
    }).compile();

    emailConfirmationTokenRepository = module.get<PrismaEmailConfirmationTokenRepository>(
      PrismaEmailConfirmationTokenRepository
    );
  });

  describe('create', () => {
    it('should create new email-confirmation-token', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const payload = { userId: Number(user.id), token: faker.string.uuid(), expiresAt: faker.date.future() };

      const result = await emailConfirmationTokenRepository.create(payload);

      expect(result).toMatchObject({
        token: payload.token,
        userId: payload.userId,
      });
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a email-confirmation-token by unique identifier', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdEmailConfirmationtoken = await prisma.emailConfirmationToken.create({
        data: { token: faker.string.uuid(), userId: user.id, expiresAt: faker.date.future() },
      });

      const result = await emailConfirmationTokenRepository.findUniqueOrThrow({
        where: { token: createdEmailConfirmationtoken.token },
      });

      expect(result).toMatchObject({
        token: createdEmailConfirmationtoken.token,
        userId: Number(createdEmailConfirmationtoken.userId),
      });
    });

    it('should throw an error if email-confirmation-token not found', async () => {
      await expect(
        emailConfirmationTokenRepository.findUniqueOrThrow({
          where: { token: 'non-existent-id' },
        })
      ).rejects.toThrow();
    });
  });

  describe('findFirstValidOrThrow', () => {
    it('should find a valid email-confirmation-token by userId', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdEmailConfirmationtoken = await prisma.emailConfirmationToken.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
          expiresAt: faker.date.future(),
        },
      });

      await expect(
        emailConfirmationTokenRepository.findFirstValidOrThrow({
          where: { userId: Number(user.id) },
        })
      ).resolves.toMatchObject({
        token: createdEmailConfirmationtoken.token,
        userId: Number(createdEmailConfirmationtoken.userId),
      });
    });

    it('should not find email-confirmation-token if used', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.emailConfirmationToken.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
          usedAt: faker.date.recent(),
          expiresAt: faker.date.future(),
        },
      });

      await expect(
        emailConfirmationTokenRepository.findFirstValidOrThrow({
          where: { userId: Number(user.id) },
        })
      ).rejects.toThrow();
    });

    it('should not find email-confirmation-token if expired', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.emailConfirmationToken.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
          usedAt: null,
          expiresAt: faker.date.recent(),
        },
      });

      await expect(
        emailConfirmationTokenRepository.findFirstValidOrThrow({
          where: { userId: Number(user.id) },
        })
      ).rejects.toThrow();
    });

    it('should throw an error if email-confirmation-token not found', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.emailConfirmationToken.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
          usedAt: faker.date.recent(),
          expiresAt: faker.date.future(),
        },
      });

      await expect(
        emailConfirmationTokenRepository.findFirstValidOrThrow({
          where: { userId: Number(user.id) },
        })
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing email-confirmation-token', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const createdEmailConfirmationtoken = await prisma.emailConfirmationToken.create({
        data: {
          token: faker.string.uuid(),
          userId: user.id,
          expiresAt: faker.date.future(),
        },
      });

      const newUsedAt = faker.date.recent();

      const result = await emailConfirmationTokenRepository.update({
        where: { token: createdEmailConfirmationtoken.token },
        data: { usedAt: newUsedAt },
      });

      expect(result.usedAt?.toISOString()).toBe(newUsedAt.toISOString());
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple email-confirmation-tokens', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      await prisma.emailConfirmationToken.createMany({
        data: [
          { token: 'token1', userId: user.id, expiresAt: faker.date.future() },
          { token: 'token2', userId: user.id, expiresAt: faker.date.future() },
        ],
      });

      const result = await emailConfirmationTokenRepository.deleteMany({ where: { userId: Number(user.id) } });

      const remainingRequests = await prisma.emailConfirmationToken.findMany({
        where: { token: { in: ['token1', 'token2'] } },
      });

      expect(result.count).toBe(2);
      expect(remainingRequests).toHaveLength(0);
    });
  });

  describe('deleteUsed', () => {
    it('should delete used email-confirmation-tokens', async () => {
      const user = await prisma.user.create({
        data: userFactory(),
      });

      const dataUsed = _.range(10).map(() => ({
        token: faker.string.uuid(),
        userId: user.id,
        usedAt: faker.date.recent(),
        expiresAt: faker.date.future(),
      }));

      const dataExpired = _.range(10).map(() => ({
        token: faker.string.uuid(),
        userId: user.id,
        usedAt: null,
        expiresAt: faker.date.recent(),
      }));

      const data = [...dataUsed, ...dataExpired];

      await prisma.emailConfirmationToken.createMany({ data });

      const result = await emailConfirmationTokenRepository.deleteUsed();

      const remainingRequests = await prisma.emailConfirmationToken.findMany({
        where: { token: { in: data.map((d) => d.token) } },
      });

      expect(result.count).toBe(data.length);
      expect(remainingRequests).toHaveLength(0);
    });
  });

  it('should not delete unused email-confirmation-tokens', async () => {
    const user = await prisma.user.create({
      data: userFactory(),
    });

    const usedData = _.range(10).map(() => ({
      token: faker.string.uuid(),
      userId: user.id,
      usedAt: faker.date.recent(),
      expiresAt: faker.date.future(),
    }));

    const unusedData = _.range(10).map(() => ({
      token: faker.string.uuid(),
      userId: user.id,
      expiresAt: faker.date.future(),
    }));

    await prisma.emailConfirmationToken.createMany({ data: [...usedData, ...unusedData] });

    const result = await emailConfirmationTokenRepository.deleteUsed();

    const remainingRequests = await prisma.emailConfirmationToken.findMany();

    expect(result.count).toBe(usedData.length);
    expect(remainingRequests).toHaveLength(unusedData.length);
  });
});

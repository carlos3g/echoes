import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { PrismaTagRepository } from '@app/tag/repositories/prisma-tag.repository';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { tagFactory, userFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

describe('PrismaTagRepository', () => {
  let tagRepository: PrismaTagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaTagRepository],
    }).compile();

    tagRepository = module.get<PrismaTagRepository>(PrismaTagRepository);
  });

  describe('create', () => {
    it('should create new source', async () => {
      const user = await prisma.user.create({ data: userFactory() });

      const payload = { ...tagFactory(), userId: Number(user.id) };

      const result = await tagRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a source by id', async () => {
      const user = await prisma.user.create({ data: userFactory() });

      const createdSource = await prisma.tag.create({
        data: { ...tagFactory(), userId: user.id },
      });

      const result = await tagRepository.findUniqueOrThrow({
        where: { uuid: createdSource.uuid },
      });

      expect(result).toMatchObject({
        ...createdSource,
        id: Number(createdSource.id),
        userId: Number(createdSource.userId),
        uuid: createdSource.uuid,
      });
    });

    it('should find a source by uuid', async () => {
      const user = await prisma.user.create({ data: userFactory() });

      const createdSource = await prisma.tag.create({
        data: { ...tagFactory(), userId: user.id },
      });

      const result = await tagRepository.findUniqueOrThrow({
        where: { uuid: createdSource.uuid },
      });

      expect(result).toMatchObject({
        ...createdSource,
        id: Number(createdSource.id),
        userId: Number(createdSource.userId),
        uuid: createdSource.uuid,
      });
    });

    it('should throw an error if source not found', async () => {
      await expect(tagRepository.findUniqueOrThrow({ where: { uuid: 'non-existent-uuid' } })).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should find many tags', async () => {
      const user = await prisma.user.create({ data: userFactory() });

      await prisma.tag.createMany({
        data: _.range(30).map(() => ({ ...tagFactory(), userId: user.id })),
      });

      const result = await tagRepository.findMany();

      expect(result).toHaveLength(30);
    });
  });

  describe('findManyPaginated', () => {
    it('should find many tags paginated', async () => {
      const user = await prisma.user.create({ data: userFactory() });

      await prisma.tag.createMany({
        data: _.range(30).map(() => ({ ...tagFactory(), userId: user.id })),
      });

      const result = await tagRepository.findManyPaginated({
        options: { page: 1, perPage: 10 },
      });

      expect(result.data).toHaveLength(10);
      expect(result.meta.total).toBe(30);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.perPage).toBe(10);
      expect(result.meta.lastPage).toBe(3);
      expect(result.meta.prev).toBeNull();
      expect(result.meta.next).toBe(2);
    });
  });

  describe('update', () => {
    it('should update an existing source', async () => {
      const user = await prisma.user.create({ data: userFactory() });

      const createdSource = await prisma.tag.create({
        data: { ...tagFactory(), userId: user.id },
      });

      const newTitle = faker.lorem.sentence();

      const result = await tagRepository.update({
        where: { uuid: createdSource.uuid },
        data: { title: newTitle },
      });

      expect(result.title).toBe(newTitle);
    });
  });
});

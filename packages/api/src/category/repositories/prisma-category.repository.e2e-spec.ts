import { PrismaCategoryRepository } from '@app/category/repositories/prisma-category.repository';
import { PrismaModule } from '@app/lib/prisma/prisma.module';
import { faker } from '@faker-js/faker';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { categoryFactory } from '@test/factories';
import { prisma } from '@test/server';
import * as _ from 'lodash';

describe('PrismaCategoryRepository', () => {
  let categoryRepository: PrismaCategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [PrismaCategoryRepository],
    }).compile();

    categoryRepository = module.get<PrismaCategoryRepository>(PrismaCategoryRepository);
  });

  describe('create', () => {
    it('should create new category', async () => {
      const payload = categoryFactory();

      const result = await categoryRepository.create(payload);

      expect(result).toMatchObject(payload);
    });
  });

  describe('findUniqueOrThrow', () => {
    it('should find a category by id', async () => {
      const createdCategory = await prisma.category.create({
        data: categoryFactory(),
      });

      const result = await categoryRepository.findUniqueOrThrow({
        where: { id: Number(createdCategory.id) },
      });

      expect(result).toMatchObject({
        ...createdCategory,
        id: Number(createdCategory.id),
        uuid: createdCategory.uuid,
      });
    });

    it('should find a category by uuid', async () => {
      const createdCategory = await prisma.category.create({
        data: categoryFactory(),
      });

      const result = await categoryRepository.findUniqueOrThrow({
        where: { uuid: createdCategory.uuid },
      });

      expect(result).toMatchObject({
        ...createdCategory,
        id: Number(createdCategory.id),
        uuid: createdCategory.uuid,
      });
    });

    it('should throw an error if category not found', async () => {
      await expect(categoryRepository.findUniqueOrThrow({ where: { uuid: 'non-existent-uuid' } })).rejects.toThrow();
    });
  });

  describe('findMany', () => {
    it('should find many categories', async () => {
      await prisma.category.createMany({
        data: _.range(30).map(categoryFactory),
      });

      const result = await categoryRepository.findMany();

      expect(result).toHaveLength(30);
    });
  });

  describe('findManyPaginated', () => {
    it('should find many categories paginated', async () => {
      await prisma.category.createMany({
        data: _.range(30).map(categoryFactory),
      });

      const result = await categoryRepository.findManyPaginated({
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
    it('should update an existing category', async () => {
      const createdCategory = await prisma.category.create({
        data: categoryFactory(),
      });

      const newTitle = faker.lorem.sentence();

      const result = await categoryRepository.update({
        where: { uuid: createdCategory.uuid },
        data: { title: newTitle },
      });

      expect(result.title).toBe(newTitle);
    });
  });

  describe('delete', () => {
    it('should delete an existing category', async () => {
      const createdCategory = await prisma.category.create({
        data: categoryFactory(),
      });

      await categoryRepository.delete({
        where: { uuid: createdCategory.uuid },
      });

      await expect(prisma.category.findUniqueOrThrow({ where: { uuid: createdCategory.uuid } })).rejects.toThrow();
    });

    it('should delete only the category passed', async () => {
      await prisma.category.createMany({
        data: _.range(5).map(categoryFactory),
      });
      const createdCategory = await prisma.category.create({
        data: categoryFactory(),
      });

      await categoryRepository.delete({ where: { uuid: createdCategory.uuid } });

      await expect(prisma.category.count()).resolves.toBe(5);
    });
  });
});
